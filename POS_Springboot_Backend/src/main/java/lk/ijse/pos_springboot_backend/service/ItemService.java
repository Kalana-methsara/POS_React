package lk.ijse.pos_springboot_backend.service;

import lk.ijse.pos_springboot_backend.dto.ItemDTO;

import java.util.List;

public interface ItemService {
    List<ItemDTO> getAllItem();
    ItemDTO getItem(String itemId);
    String saveItem(ItemDTO itemDTO);
    String updateItem(ItemDTO itemDTO);
    String deleteItem(String itemId);
}
