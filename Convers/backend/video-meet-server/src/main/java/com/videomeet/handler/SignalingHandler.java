package com.videomeet.handler;

import org.springframework.web.socket.*;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class SignalingHandler extends TextWebSocketHandler {

    private static final List<WebSocketSession> sessions =
            new ArrayList<>();

    private static final Map<String, String> roomMap =
            new ConcurrentHashMap<>();

    private static final Map<String, String> userMap =
            new ConcurrentHashMap<>();

    private static final Map<String, Integer> roomCount =
            new ConcurrentHashMap<>();

    private static final Map<String, List<String>> roomUsersMap =
            new ConcurrentHashMap<>();

    private static final ObjectMapper objectMapper =
            new ObjectMapper();

    @Override
    public void afterConnectionEstablished(
            WebSocketSession session) {

        sessions.add(session);

        System.out.println(
                "Connected : "
                        + session.getId());
    }

    @Override
    public void afterConnectionClosed(
            WebSocketSession session,
            CloseStatus status) throws Exception {

        String meetingId =
                roomMap.get(session.getId());

        String userName =
                userMap.get(session.getId());

        Map<String, Object> leftMessage =
                new ConcurrentHashMap<>();

        leftMessage.put("type", "user-left");
        leftMessage.put("userName", userName);

        String json =
                objectMapper.writeValueAsString(leftMessage);

        for (WebSocketSession s : sessions) {

            String receiverRoom =
                    roomMap.get(s.getId());

            if (!s.getId().equals(session.getId())
                    &&
                    meetingId != null
                    &&
                    meetingId.equals(receiverRoom)) {

                s.sendMessage(
                        new TextMessage(json));
            }
        }
        if (meetingId != null
                && userName != null) {

            List<String> users =
                    roomUsersMap.get(meetingId);

            if (users != null) {

                users.remove(userName);

                Map<String, Object> participantData =
                        new ConcurrentHashMap<>();

                participantData.put(
                        "type",
                        "participants"
                );

                participantData.put(
                        "users",
                        users
                );

                String participantMessage =
                        objectMapper.writeValueAsString(
                                participantData
                        );

                for (WebSocketSession s : sessions) {

                    String room =
                            roomMap.get(
                                    s.getId());

                    if (meetingId.equals(room)
                            &&
                            !s.getId().equals(
                                    session.getId())) {

                        s.sendMessage(
                                new TextMessage(
                                        participantMessage
                                )
                        );
                    }
                }
            }
        }
        sessions.remove(session);
        roomMap.remove(session.getId());
        userMap.remove(session.getId());

        System.out.println(
                "Disconnected : "
                        + session.getId());

        System.out.println(
                "User Left : "
                        + userName);

        System.out.println(
                "Remaining Users : "
                        + roomUsersMap.get(
                        meetingId));
    }

    @Override
    protected void handleTextMessage(
            WebSocketSession session,
            TextMessage message)
            throws Exception {

        Map<String, Object> data =
                objectMapper.readValue(
                        message.getPayload(),
                        Map.class);

        String meetingId =
                (String) data.get("meetingId");

        if (meetingId != null) {

            roomMap.put(
                    session.getId(),
                    meetingId);

            if ("join".equals(data.get("type"))) {

                roomCount.put(
                        meetingId,
                        roomCount.getOrDefault(
                                meetingId,
                                0
                        ) + 1
                );

                System.out.println(
                        "User Joined : "
                                + data.get("userName")
                );
            }

            System.out.println(
                    "Room "
                            + meetingId
                            + " Count : "
                            + roomCount.get(
                            meetingId
                    )
            );
        }
        String userName =
                (String) data.get("userName");

        if (userName != null) {

            userMap.put(
                    session.getId(),
                    userName);
        }
        if ("join".equals(data.get("type"))
                && meetingId != null
                && userName != null) {

            roomUsersMap
                    .computeIfAbsent(
                            meetingId,
                            k -> new ArrayList<>()
                    )
                    .add(userName);

            System.out.println(
                    "Room Users : "
                            + roomUsersMap.get(
                            meetingId
                    )
            );
            Map<String, Object> participantData =
                    new ConcurrentHashMap<>();

            participantData.put(
                    "type",
                    "participants"
            );

            participantData.put(
                    "users",
                    roomUsersMap.get(
                            meetingId
                    )
            );

            String participantMessage =
                    objectMapper.writeValueAsString(
                            participantData
                    );

            for (WebSocketSession s : sessions) {

                String senderRoom =
                        roomMap.get(
                                session.getId());

                String receiverRoom =
                        roomMap.get(
                                s.getId());

                if (senderRoom != null
                        &&
                        senderRoom.equals(
                                receiverRoom)) {

                    s.sendMessage(
                            new TextMessage(
                                    participantMessage
                            )
                    );
                }
            }
        }
        if ("join".equals(data.get("type"))) {

            for (WebSocketSession s : sessions) {

                if (!s.getId().equals(session.getId())) {

                    String room1 =
                            roomMap.get(session.getId());

                    String room2 =
                            roomMap.get(s.getId());

                    if (room1 != null &&
                            room1.equals(room2)) {

                        String existingUser =
                                userMap.get(s.getId());

                        if (existingUser != null) {

                            session.sendMessage(
                                    new TextMessage(
                                            objectMapper.writeValueAsString(
                                                    Map.of(
                                                            "type", "join",
                                                            "userName", existingUser
                                                    )
                                            )
                                    )
                            );
                        }
                    }
                }
            }
        }

        System.out.println(
                "Received : "
                        + message.getPayload());
        String type =
                (String) data.get("type");

        if ("join".equals(type)) {

            System.out.println(
                    "User Joined : "
                            + data.get("userName"));
        }

        for (WebSocketSession s : sessions) {

            String senderRoom =
                    roomMap.get(
                            session.getId());

            String receiverRoom =
                    roomMap.get(
                            s.getId());

            if (!s.getId().equals(
                    session.getId())
                    &&
                    senderRoom != null
                    &&
                    senderRoom.equals(
                            receiverRoom)) {

                s.sendMessage(
                        new TextMessage(
                                message.getPayload()));
            }
        }
    }

    private int getParticipantCount(
            String meetingId) {

        int count = 0;

        for (String room : roomMap.values()) {

            if (meetingId.equals(room)) {

                count++;
            }
        }

        return count;
    }
}