import asyncio
from collections import defaultdict
from typing import Optional

from fastapi import WebSocket
from loguru import logger


class SubscriptionManager:
    _client_subscriptions: dict[WebSocket, set[str]] = defaultdict(set)
    _device_subscribers: dict[str, set[WebSocket]] = defaultdict(set)
    _client_sub_lock: dict[WebSocket, asyncio.Lock] = defaultdict(asyncio.Lock)
    _device_sub_lock: dict[str, asyncio.Lock] = defaultdict(asyncio.Lock)

    _instance: Optional["SubscriptionManager"] = None

    def __init__(self):
        if self._instance is not None:
            raise Exception("Singleton class")
        self._instance = self

    @classmethod
    def get_instance(cls) -> "SubscriptionManager":
        if cls._instance is None:
            cls._instance = SubscriptionManager()
        return cls._instance

    async def subscribe(self, websocket: WebSocket, _id: str):
        async with self._client_sub_lock[websocket]:
            async with self._device_sub_lock[_id]:
                self._client_subscriptions[websocket].add(_id)
                self._device_subscribers[_id].add(websocket)
        logger.info("Websocket client subscribed to device [{}]", _id)

    async def unsubscribe(self, websocket: WebSocket):
        async with self._client_sub_lock[websocket]:
            for subscribed_device in self._client_subscriptions[websocket]:
                async with self._device_sub_lock[subscribed_device]:
                    self._device_subscribers[subscribed_device].remove(websocket)
            self._client_subscriptions.pop(websocket)
        logger.info("Websocket client unsubscribed")

    async def broadcast(self, _id: str, json_data: str):
        async with self._device_sub_lock[_id]:
            for subscriber in self._device_subscribers[_id]:
                await subscriber.send_text(json_data)
