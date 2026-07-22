package com.property.market.model;

import java.util.List;

public record PredictionResponse(
    List<Double> predictions
) {
}
