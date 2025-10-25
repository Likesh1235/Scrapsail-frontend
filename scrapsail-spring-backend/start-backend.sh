# ScrapSail Backend Environment Setup
# Run these commands before starting the Spring Boot application

# Set Gmail credentials for OTP functionality
# Replace with your actual Gmail credentials
export MAIL_USERNAME=your-email@gmail.com
export MAIL_PASSWORD=your-app-password

# Verify environment variables are set
echo "MAIL_USERNAME: $MAIL_USERNAME"
echo "MAIL_PASSWORD: $MAIL_PASSWORD"

# Start the Spring Boot application
echo "Starting ScrapSail Backend..."
mvn spring-boot:run

