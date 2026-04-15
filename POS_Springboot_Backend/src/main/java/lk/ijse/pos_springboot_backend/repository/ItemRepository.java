package lk.ijse.pos_springboot_backend.repository;

import lk.ijse.pos_springboot_backend.entity.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ItemRepository extends JpaRepository<Item,String> {
}
