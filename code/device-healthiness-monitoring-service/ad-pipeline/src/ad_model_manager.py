from collections import defaultdict

import numpy as np
import post_processing
import schemas
from pysad.models import IForestASD

HIGHER_THRESHOLD = 0.1

WINDOW_SIZE = 2000


class ADModelManager:
    ad_models = defaultdict(lambda: IForestASD(window_size=WINDOW_SIZE))

    def predict(self, data: schemas.TelemetryData) -> bool:
        features = np.array([data.value])
        score = self.ad_models[data.model_hash_key].fit_score_partial(features)
        return post_processing.decision_by_threshold(
            score, upper_threshold=HIGHER_THRESHOLD
        )
