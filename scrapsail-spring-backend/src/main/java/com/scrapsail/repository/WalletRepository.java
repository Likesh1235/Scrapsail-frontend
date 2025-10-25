package com.scrapsail.repository;

import com.scrapsail.entity.CarbonWallet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface WalletRepository extends JpaRepository<CarbonWallet, Long> {
    Optional<CarbonWallet> findByUserId(Long userId);
    boolean existsByUserId(Long userId);
}

