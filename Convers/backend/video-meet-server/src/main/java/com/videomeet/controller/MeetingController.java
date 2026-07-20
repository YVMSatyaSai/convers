package com.videomeet.controller;

import com.videomeet.config.LiveKitConfig.LiveKitProperties;
import io.livekit.server.AccessToken;
import io.livekit.server.RoomJoin;
import io.livekit.server.RoomName;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = {
        "http://localhost:5173",
        "https://localhost:5173"
})
@RestController
public class MeetingController {

    private final LiveKitProperties properties;

    public MeetingController(LiveKitProperties properties) {
        this.properties = properties;
    }

    @GetMapping("/api/token")
    public String getToken(
            @RequestParam String room,
            @RequestParam String identity) {

        AccessToken token = new AccessToken(
                properties.apiKey(),
                properties.apiSecret());

        token.setIdentity(identity);

        token.addGrants(
                new RoomJoin(true),
                new RoomName(room)
        );

        return token.toJwt();
    }
}