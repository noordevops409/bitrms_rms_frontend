package com.digitrinity.controller;

import com.digitrinity.model.VLithLatestDataPart1;
import com.digitrinity.model.VLithLatestDataPart2;
import com.digitrinity.model.VLithLatestDataPart3;
import com.digitrinity.model.VLithLatestDataPart4;
import com.digitrinity.response.GenericResponseHandler;
import com.digitrinity.service.VLithDataService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lithium")
public class VLithDataController {

    @Autowired
    private VLithDataService lithDataService;

    @GetMapping(path = "/part1", produces = "application/json")
    public ResponseEntity<Object> getLithiumPart1(
            @RequestHeader(value = "Authorization") String accessToken) {

        List<VLithLatestDataPart1> data = lithDataService.getPart1Data();
        return new GenericResponseHandler.Builder()
                .setData(data)
                .setMessage("Part 1 data displayed successfully")
                .setStatus(HttpStatus.OK)
                .create();
    }

    @GetMapping(path = "/part2", produces = "application/json")
    public ResponseEntity<Object> getLithiumPart2(
            @RequestHeader(value = "Authorization") String accessToken) {

        List<VLithLatestDataPart2> data = lithDataService.getPart2Data();
        return new GenericResponseHandler.Builder()
                .setData(data)
                .setMessage("Part 2 data displayed successfully")
                .setStatus(HttpStatus.OK)
                .create();
    }

    @GetMapping(path = "/part3", produces = "application/json")
    public ResponseEntity<Object> getLithiumPart3(
            @RequestHeader(value = "Authorization") String accessToken) {

        List<VLithLatestDataPart3> data = lithDataService.getPart3Data();
        return new GenericResponseHandler.Builder()
                .setData(data)
                .setMessage("Part 3 data displayed successfully")
                .setStatus(HttpStatus.OK)
                .create();
    }

    @GetMapping(path = "/part4", produces = "application/json")
    public ResponseEntity<Object> getLithiumPart4(
            @RequestHeader(value = "Authorization") String accessToken) {

        List<VLithLatestDataPart4> data = lithDataService.getPart4Data();
        return new GenericResponseHandler.Builder()
                .setData(data)
                .setMessage("Part 4 data displayed successfully")
                .setStatus(HttpStatus.OK)
                .create();
    }
}
