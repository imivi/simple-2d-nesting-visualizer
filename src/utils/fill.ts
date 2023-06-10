import { Box2, Vector2 } from "three"

/**
 * Fill an area with a shape. If any space remains,
 * fill that too but with the rotated shape.
 * Returns a list of shape positions as Surfaces (in the form [start,end])
 * @param surface 
 * @param size 
 */
export function fill(surface: Box2, size: Vector2): Box2[] {

    // console.info('Analyzing surface:', surface)

    const start = surface.min
    const end   = surface.max

    const rows_and_cols = end.clone().sub(start).divide(size)
    
    const rows = Math.floor(rows_and_cols.x)
    const cols = Math.floor(rows_and_cols.y)

    const new_end = new Vector2(rows,cols).clone().multiply(size)

    const surface_filled = new Box2(
        start,
        new_end,
    )

    const positions: Box2[] = []
    for(let i_row=0; i_row<rows; i_row++) {
        for(let i_col=0; i_col<cols; i_col++) {
            const item_start_position = start.clone().add(new Vector2(i_row,i_col).clone().multiply(size))
            const position = new Box2(item_start_position, item_start_position.clone().add(size))
            positions.push(position)
        }
    }
    
    // const count = positions.length


    // If the shape is horizontal, partition horizontally
    const surface_leftover_x = new Box2(
        new Vector2(surface_filled.max.x, 0),
        new Vector2(end.x, surface_filled.max.y),
    )

    // If the shape is vertical, partition vertically
    const surface_leftover_y = new Box2(
        new Vector2(0, surface_filled.max.y),
        new Vector2(surface_filled.max.x, end.y),
    )

    if(isHorizontal(size) && fits(surface_leftover_x, rotate(size))) {
        // console.info(`Returning ${count} (${rows}x${cols}) leftover x ${surface_leftover_x}`)
        return [...positions, ...fill(surface_leftover_x, rotate(size))]
    }

    else if(isVertical(size) && fits(surface_leftover_y, rotate(size))) {
        // console.info(`Returning ${count} (${rows}x${cols}) leftover y ${surface_leftover_y}`)
        return [...positions, ...fill(surface_leftover_y, rotate(size))]
    }
    
    // console.info('(End) returning', count, surface_filled)
    return positions
}

export function isHorizontal(vector: Vector2) {
    return vector.x >= vector.y
}

export function isVertical(vector: Vector2) {
    return vector.y >= vector.x
}

export function rotate(vector: Vector2) {
    return new Vector2(vector.y, vector.x)
}

export function fits(box: Box2, vector: Vector2) {
    const box_size_x = box.max.x - box.min.x
    const box_size_y = box.max.y - box.min.y

    return box_size_x >= vector.x && box_size_y >= vector.y
}