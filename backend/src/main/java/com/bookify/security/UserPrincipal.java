package com.bookify.security;

import com.bookify.entity.User;
import com.bookify.entity.UserStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.Collection;
import java.util.Collections;

@Getter
@AllArgsConstructor
public class UserPrincipal implements UserDetails {
    private final Long id;
    private final String name;
    private final String email;
    private final String password;
    private final UserStatus status;
    private final Boolean emailVerified;
    private final Collection<? extends GrantedAuthority> authorities;

    public static UserPrincipal create(User user) {
        String roleName = user.getRole() != null ? user.getRole().name() : "ROLE_USER";
        GrantedAuthority authority = new SimpleGrantedAuthority(roleName);
        return new UserPrincipal(
                user.getId(),
                user.getName() != null ? user.getName() : "Reader",
                user.getEmail(),
                user.getPassword(),
                user.getStatus() != null ? user.getStatus() : UserStatus.ACTIVE,
                user.getEmailVerified() != null ? user.getEmailVerified() : true,
                Collections.singletonList(authority));
    }

    @Override public String getUsername() { return email; }
    @Override public String getPassword() { return password; }
    @Override public boolean isAccountNonExpired() { return true; }
    @Override public boolean isAccountNonLocked() { return status != UserStatus.BANNED; }
    @Override public boolean isCredentialsNonExpired() { return true; }
    @Override public boolean isEnabled() { return status == UserStatus.ACTIVE; }
}
