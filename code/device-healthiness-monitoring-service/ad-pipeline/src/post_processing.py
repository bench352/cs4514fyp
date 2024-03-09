import math


def decision_by_threshold(score, upper_threshold=math.inf, lower_threshold=-math.inf):
    return True if score > upper_threshold or score < lower_threshold else False
