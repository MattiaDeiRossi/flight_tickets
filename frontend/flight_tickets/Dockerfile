FROM nginx
LABEL maintainer="Mattia Dei Rossi <885768@stud.unive.it>"

# Copy static assets from builder stage
COPY dist/flight_tickets/browser /usr/share/nginx/html

# Expose port 80
EXPOSE 80