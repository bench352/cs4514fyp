import abc
from typing import AsyncIterable, Generic, TypeVar

ExtractedT = TypeVar("ExtractedT")
TransformedT = TypeVar("TransformedT")


class BaseETLPipeline(abc.ABC, Generic[ExtractedT, TransformedT]):
    @abc.abstractmethod
    async def extract(self) -> AsyncIterable[ExtractedT]:
        pass

    @abc.abstractmethod
    async def transform(self, extracted: ExtractedT) -> TransformedT | None:
        pass

    @abc.abstractmethod
    async def load(self, transformed: TransformedT) -> None:
        pass

    @abc.abstractmethod
    async def run(self) -> None:
        pass
