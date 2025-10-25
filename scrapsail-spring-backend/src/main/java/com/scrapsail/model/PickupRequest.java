package com.scrapsail.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "pickups")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PickupRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "waste_category", nullable = false)
    private String wasteCategory;

    @Column(nullable = false)
    private Double weight;

    @Column(name = "pickup_address", nullable = false, columnDefinition = "TEXT")
    private String pickupAddress;

    private Double latitude;
    private Double longitude;

    @Column(name = "scheduled_date", nullable = false)
    private java.time.LocalDateTime scheduledDate;

    @Column(name = "status")
    private String status = "pending";

    @Column(name = "assigned_collector_id")
    private Long assignedCollectorId;

    @Column(name = "carbon_credits_earned")
    private Integer carbonCreditsEarned = 0;

    @Column(name = "admin_notes", columnDefinition = "TEXT")
    private String adminNotes;

    @Column(name = "collector_notes", columnDefinition = "TEXT")
    private String collectorNotes;

    @Column(name = "completion_date")
    private java.time.LocalDateTime completionDate;

    @Column(name = "created_at")
    private java.time.LocalDateTime createdAt = java.time.LocalDateTime.now();

    @Column(name = "updated_at")
    private java.time.LocalDateTime updatedAt = java.time.LocalDateTime.now();

    // Additional fields for controller compatibility
    @Transient
    private String name;
    
    @Transient
    private String email;
    
    @Transient
    private String phone;
    
    @Transient
    private String scrapType;
    
    @Transient
    private String pickupDate;
    
    @Transient
    private String address;
}


