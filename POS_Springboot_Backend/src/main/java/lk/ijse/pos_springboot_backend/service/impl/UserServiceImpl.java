package lk.ijse.pos_springboot_backend.service.impl;

import lk.ijse.pos_springboot_backend.dto.AuthDTO;
import lk.ijse.pos_springboot_backend.dto.AuthResponseDTO;
import lk.ijse.pos_springboot_backend.dto.RegisterDTO;
import lk.ijse.pos_springboot_backend.entity.User;
import lk.ijse.pos_springboot_backend.entity.enums.Role;
import lk.ijse.pos_springboot_backend.repository.UserRepository;
import lk.ijse.pos_springboot_backend.service.UserService;
import lk.ijse.pos_springboot_backend.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;



    @Override
    public String saveUser(RegisterDTO registerDTO){
        if (userRepository.findByUsername(registerDTO.getUsername()).isPresent()){
            throw new RuntimeException("Username is already in use");
        }
        if (userRepository.findByEmail(registerDTO.getEmail()).isPresent()){
            throw new IllegalStateException("Email is already in use");
        }
        String roleStr = registerDTO.getRole();
        if (roleStr == null || roleStr.trim().isEmpty()) {
            roleStr = "USER";
        }
        Role role;
        try {
            role = Role.valueOf(roleStr.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid role: " + roleStr + ". Valid roles are: ADMIN, MANAGER, USER");
        }
        User user = User.builder()
                .username(registerDTO.getUsername())
                .email(registerDTO.getEmail())
                .password(passwordEncoder.encode(registerDTO.getPassword()))
                .role(role)
                .build();
        userRepository.save(user);
        return "User registered successfully";
    }

    public AuthResponseDTO authenticate(AuthDTO authDTO){
        User user;
        String loginInput = authDTO.getUsername(); // This can be username OR email

        if (loginInput != null && loginInput.contains("@")) {
            user = userRepository.findByEmail(loginInput)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + loginInput));
        } else {
            user = userRepository.findByUsername(loginInput)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + loginInput));
        }

        if (!passwordEncoder.matches(authDTO.getPassword(), user.getPassword())){
            throw new BadCredentialsException("Wrong password");
        }

        // Use the actual username from the database for token generation
        String token = jwtUtil.generateToken(user.getUsername(), user.getRole());
        return new AuthResponseDTO(token);
    }
}
