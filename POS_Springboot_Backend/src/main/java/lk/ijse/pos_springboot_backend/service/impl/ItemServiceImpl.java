package lk.ijse.pos_springboot_backend.service.impl;

import lk.ijse.pos_springboot_backend.dto.ItemDTO;
import lk.ijse.pos_springboot_backend.entity.Item;
import lk.ijse.pos_springboot_backend.entity.enums.UnitType;
import lk.ijse.pos_springboot_backend.repository.ItemRepository;
import lk.ijse.pos_springboot_backend.service.ItemService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ItemServiceImpl implements ItemService {

    private final ItemRepository itemRepository;
    private final ModelMapper modelMapper;

    @Override
    public List<ItemDTO> getAllItem() {
        return modelMapper.map(itemRepository.findAll(), new TypeToken<List<ItemDTO>>() {}.getType());
    }

    @Override
    public ItemDTO getItem(String itemId) {
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Staff with ID " + itemId + " not found"));
        return modelMapper.map(item, ItemDTO.class);    }

    @Override
    public String saveItem(ItemDTO itemDTO) {
        Item item = Item.builder()
                .id(generateItemID())
                .description(itemDTO.getDescription())
                .price(itemDTO.getPrice())
                .quantity(itemDTO.getQuantity())
                .unit(UnitType.valueOf(itemDTO.getUnit()))
                .build();

        itemRepository.save(item);
        return "Item saved successfully";
    }

    private String generateItemID() {
        List<Item> items = itemRepository.findAll();
        if (items.isEmpty()) {
            return "I001";
        }
        String lastId = items.get(items.size() - 1).getId();
        int newId = Integer.parseInt(lastId.substring(1)) + 1;

        return String.format("I%03d", newId);
    }

    @Override
    public String updateItem(ItemDTO itemDTO) {
        Item item = Item.builder()
                .id(itemDTO.getId())
                .description(itemDTO.getDescription())
                .price(itemDTO.getPrice())
                .quantity(itemDTO.getQuantity())
                .unit(UnitType.valueOf(itemDTO.getUnit()))
                .build();

        itemRepository.save(item);
        return "Item updated successfully";
    }

    @Override
    public String deleteItem(String itemId) {
        if (!itemRepository.existsById(itemId)) {
            throw new RuntimeException("Item with ID " + itemId + " does not exist");
        }
        itemRepository.deleteById(itemId);
        return "Item deleted successfully";
    }
}
