## NOTE
- LocalStrategy định nghĩa cách xác thực, còn AuthGuard('local') là cách bạn kích hoạt nó khi có request đến.

## ROTATE
- Rotate refresh token là một kỹ thuật bảo mật trong hệ thống xác thực dùng JWT, trong đó mỗi lần refresh token được sử dụng, hệ thống sẽ cấp một refresh token mới và vô hiệu hoá cái cũ.