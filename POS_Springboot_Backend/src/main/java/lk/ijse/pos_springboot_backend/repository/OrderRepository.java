package lk.ijse.pos_springboot_backend.repository;

import lk.ijse.pos_springboot_backend.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, String> {
    Optional<Order> findTopByOrderByIdDesc();
}
