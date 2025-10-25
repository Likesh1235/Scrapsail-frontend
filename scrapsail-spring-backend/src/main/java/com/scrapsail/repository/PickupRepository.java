package com.scrapsail.repository;

import com.scrapsail.model.PickupRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PickupRepository extends JpaRepository<PickupRequest, Long> {
    
    // Find pickup requests by email
    List<PickupRequest> findByEmail(String email);
    
    // Find pickup requests by status
    List<PickupRequest> findByStatus(String status);
    
    // Find pickup requests by scrap type
    List<PickupRequest> findByScrapType(String scrapType);
    
    // Find recent pickup requests (last 30 days)
    @Query("SELECT p FROM PickupRequest p WHERE p.createdAt >= CURRENT_DATE - 30 ORDER BY p.createdAt DESC")
    List<PickupRequest> findRecentPickups();
    
    // Count pickup requests by status
    long countByStatus(String status);
    
    // Additional methods for PickupService compatibility
    List<PickupRequest> findByStatusOrderByCreatedAtDesc(String status);
    List<PickupRequest> findByCollectorId(Long collectorId);
    List<PickupRequest> findByUserId(Long userId);
}