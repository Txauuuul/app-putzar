#!/usr/bin/env python3
"""Script para crear iconos PWA del logo Putero & Zarigüeya"""

from PIL import Image, ImageDraw, ImageFont
import os

def create_icon(size, filename):
    """Create a PWA icon with the logo design"""
    # Create image with dark background
    img = Image.new('RGBA', (size, size), (10, 14, 39, 255))  # Dark blue-black background
    draw = ImageDraw.Draw(img)
    
    # Draw a decorative shield/box outline in gold
    margin = int(size * 0.1)
    draw.rectangle(
        [(margin, margin), (size - margin, size - margin)],
        outline=(255, 193, 7, 255),  # Gold color
        width=int(size * 0.04)
    )
    
    # Draw a bow tie symbol in the center
    center_x = size // 2
    center_y = size // 2
    
    # Draw bow (simple triangles)
    bow_size = int(size * 0.15)
    # Left side of bow
    draw.polygon(
        [(center_x - bow_size, center_y - bow_size),
         (center_x - bow_size * 0.3, center_y),
         (center_x - bow_size, center_y + bow_size)],
        fill=(255, 193, 7, 255)
    )
    # Right side of bow
    draw.polygon(
        [(center_x + bow_size, center_y - bow_size),
         (center_x + bow_size * 0.3, center_y),
         (center_x + bow_size, center_y + bow_size)],
        fill=(255, 193, 7, 255)
    )
    
    # Draw three dots (vest buttons)
    dot_radius = int(size * 0.03)
    for i in range(-1, 2):
        y_pos = center_y + int(size * 0.08 * i)
        draw.ellipse(
            [(center_x - dot_radius, y_pos - dot_radius),
             (center_x + dot_radius, y_pos + dot_radius)],
            fill=(255, 193, 7, 255)
        )
    
    # Add a rose symbol
    rose_size = int(size * 0.04)
    draw.ellipse(
        [(center_x + bow_size + int(size * 0.05), center_y - int(size * 0.1) - rose_size),
         (center_x + bow_size + int(size * 0.05) + rose_size * 2, center_y - int(size * 0.1) + rose_size)],
        fill=(220, 38, 38, 200)  # Red-ish color for rose
    )
    
    # Save the icon
    output_path = f'public/{filename}'
    img.save(output_path, 'PNG')
    print(f'✅ Created {filename}')
    return output_path

def create_maskable_icon(size, filename):
    """Create a maskable icon (with safe zone padding)"""
    # Create image with transparent background
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Draw the icon centered in the safe zone
    center_x = size // 2
    center_y = size // 2
    
    # Draw bow tie - larger for maskable
    bow_size = int(size * 0.2)
    # Left side of bow
    draw.polygon(
        [(center_x - bow_size, center_y - bow_size),
         (center_x - bow_size * 0.3, center_y),
         (center_x - bow_size, center_y + bow_size)],
        fill=(255, 193, 7, 255)
    )
    # Right side of bow  
    draw.polygon(
        [(center_x + bow_size, center_y - bow_size),
         (center_x + bow_size * 0.3, center_y),
         (center_x + bow_size, center_y + bow_size)],
        fill=(255, 193, 7, 255)
    )
    
    # Draw three dots
    dot_radius = int(size * 0.035)
    for i in range(-1, 2):
        y_pos = center_y + int(size * 0.1 * i)
        draw.ellipse(
            [(center_x - dot_radius, y_pos - dot_radius),
             (center_x + dot_radius, y_pos + dot_radius)],
            fill=(255, 193, 7, 255)
        )
    
    output_path = f'public/{filename}'
    img.save(output_path, 'PNG')
    print(f'✅ Created {filename}')
    return output_path

if __name__ == '__main__':
    print('🎨 Generating PWA icons...')
    
    # Create icons
    create_icon(192, 'icon-192x192.png')
    create_icon(512, 'icon-512x512.png')
    create_maskable_icon(192, 'icon-maskable.png')
    
    print('✨ All icons created successfully!')
