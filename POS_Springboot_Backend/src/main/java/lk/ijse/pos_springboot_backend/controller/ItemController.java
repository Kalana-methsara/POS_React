package lk.ijse.pos_springboot_backend.controller;

import jakarta.validation.Valid;
import lk.ijse.pos_springboot_backend.dto.ItemDTO;
import lk.ijse.pos_springboot_backend.service.ItemService;
import lk.ijse.pos_springboot_backend.util.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/item")
public class ItemController {
    private final ItemService itemService;

    // SAVE ITEM
    @PostMapping
    public ResponseEntity<ApiResponse> saveItem(@Valid @RequestBody ItemDTO itemDTO) {
        return ResponseEntity.ok(new ApiResponse(
                200, "Item Saved Successfully", itemService.saveItem(itemDTO))
        );
    }

    // GET ALL ITEM
    @GetMapping("/all")
    public ResponseEntity<ApiResponse> getAllItem() {
        List<ItemDTO> itemList = itemService.getAllItem();
        return new ResponseEntity<>(
                new ApiResponse(200, "Success", itemList),
                HttpStatus.OK
        );
    }

    // GET ITEM BY ID
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getItem(@PathVariable String id) {
        ItemDTO item = itemService.getItem(id);
        return new ResponseEntity<>(
                new ApiResponse(200, "Success", item),
                HttpStatus.OK
        );
    }

    // UPDATE ITEM
    @PutMapping
    public ResponseEntity<ApiResponse> updateItem(@Valid @RequestBody ItemDTO itemDTO) {
        return new ResponseEntity<>(
                new ApiResponse(200, "Item Updated Successfully", itemService.updateItem(itemDTO)),
                HttpStatus.OK
        );
    }

    // DELETE ITEM
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteItem(@PathVariable String id) {
        return new ResponseEntity<>(
                new ApiResponse(200, "Item Deleted Successfully", itemService.deleteItem(id)),
                HttpStatus.OK
        );
    }
}
