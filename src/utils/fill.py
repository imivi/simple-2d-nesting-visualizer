
def fill_with_positions(surface: Surface, size: Vector2D) -> List[Surface]:
    """
    Fill an area with a shape. If any space remains,
    fill that too but with the rotated shape.
    Returns a list of shape positions as Surfaces (in the form [start,end])
    """
    print('Analyzing surface:', surface)

    start = surface.start
    end   = surface.end

    rows,cols = math.floor((end-start) / size)
    new_end = Vector2D(rows,cols) * size
    surface_filled = Surface(
        start,
        new_end,
    )

    positions: List[Surface] = []
    for i_row in range(rows):
        for i_col in range(cols):
            item_start_position = start + Vector2D(i_row,i_col)*size
            position = Surface(item_start_position, item_start_position+size)
            positions.append(position)
    
    # count = rows*cols
    count = len(positions)


    # If the shape is horizontal, partition horizontally
    surface_leftover_x = Surface(
        Vector2D(surface_filled.end.x, 0),
        Vector2D(end.x, surface_filled.end.y),
    )

    # If the shape is vertical, partition vertically
    surface_leftover_y = Surface(
        Vector2D(0, surface_filled.end.y),
        Vector2D(surface_filled.end.x, end.y),
    )

    if size.is_horizontal() and surface_leftover_x.fits(size.rotate()):
        print(f'Returning {count} ({rows}x{cols}) leftover x {surface_leftover_x}')
        return positions + fill_with_positions(surface_leftover_x, size.rotate())

    elif size.is_vertical() and surface_leftover_y.fits(size.rotate()):
        print(f'Returning {count} ({rows}x{cols}) leftover y {surface_leftover_y}')
        return positions + fill_with_positions(surface_leftover_y, size.rotate())
    
    print('(End) returning', count, surface_filled)
    return positions
