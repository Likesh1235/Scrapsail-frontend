package com.scrapsail.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "carbon_wallets")
@Getter 
@Setter 
@NoArgsConstructor
@AllArgsConstructor
public class CarbonWallet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;
    
    @Column(name = "total_credits")
    private int totalCredits = 0;
    
    @Column(name = "cash_balance")
    private int cashBalance = 0;
    
    @Column(name = "created_at")
    private java.time.LocalDateTime createdAt = java.time.LocalDateTime.now();
    
    @Column(name = "updated_at")
    private java.time.LocalDateTime updatedAt = java.time.LocalDateTime.now();
}

