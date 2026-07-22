package com.property.market.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.property.market.model.MarketStatistics;
import com.property.market.service.MarketAnalysisService;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.RequestParam;

import com.property.market.model.PropertyRecord;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.property.market.model.PredictionHouse;
import com.property.market.model.PredictionResponse;
import com.property.market.service.MlPredictionService;

@RestController
@RequestMapping("/api/market")
public class MarketAnalysisController {

    private final MarketAnalysisService marketAnalysisService;
    private final MlPredictionService mlPredictionService;

    public MarketAnalysisController(
        MarketAnalysisService marketAnalysisService,
        MlPredictionService mlPredictionService
    ) {
        this.marketAnalysisService = marketAnalysisService;
        this.mlPredictionService = mlPredictionService;
    }

    @GetMapping("/statistics")
    public MarketStatistics getStatistics() {
        return marketAnalysisService.getStatistics();
    }

    @GetMapping("/properties")
    public List<PropertyRecord> getProperties(
        @RequestParam(required = false)
        Double minimumPrice,

        @RequestParam(required = false)
        Double maximumPrice,

        @RequestParam(required = false)
        Integer minimumBedrooms,

        @RequestParam(required = false)
        Double minimumSchoolRating
    ) {
        return marketAnalysisService.findProperties(
            minimumPrice,
            maximumPrice,
            minimumBedrooms,
            minimumSchoolRating
        );
    }

    @PostMapping("/what-if")
    public PredictionResponse predictWhatIf(
        @RequestBody PredictionHouse house
    ) {
        return mlPredictionService.predict(house);
    }

    @GetMapping("/model-info")
    public Map<String, Object> getModelInfo() {
        return mlPredictionService.getModelInfo();
    }
}
