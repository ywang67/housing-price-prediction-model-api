package com.property.market.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import com.property.market.model.PredictionHouse;
import com.property.market.model.PredictionRequest;
import com.property.market.model.PredictionResponse;

import java.net.http.HttpClient;

import org.springframework.http.client.JdkClientHttpRequestFactory;

@Service
public class MlPredictionService {

    private final RestClient restClient;

    public MlPredictionService(
        RestClient.Builder restClientBuilder,
        @Value("${ml.api-url}") String mlApiUrl
    ) {
        HttpClient httpClient = HttpClient.newBuilder()
            .version(HttpClient.Version.HTTP_1_1)
            .build();

        this.restClient = restClientBuilder
            .requestFactory(
                new JdkClientHttpRequestFactory(httpClient)
            )
            .baseUrl(mlApiUrl)
            .build();
    }

    public PredictionResponse predict(
        PredictionHouse house
    ) {
        return restClient.post()
            .uri("/predict")
            .contentType(MediaType.APPLICATION_JSON)
            .body(new PredictionRequest(List.of(house)))
            .retrieve()
            .body(PredictionResponse.class);
    }
}
