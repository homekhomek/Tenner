import React, { useRef, useEffect, useState } from 'react';

const TILE_SIZE = 26;
const BOARD_WIDTH = 12;
const BOARD_HEIGHT = 20;

const PALETTE = ["#20463f", "#4149b1", "#9e3420", "#51473f", "#897769", "#f6dbc4", "#71c1c1", "#dbb54c", "#df9ee9"];

const PlayScreen = () => {
    const [board, setBoard] = useState([]);
    const [selection, setSelection] = useState({});
    const [cornerOne, setCornerOne] = useState({});
    const [cornerTwo, setCornerTwo] = useState({});
    const [score, setScore] = useState(0);
    const distMethod = (weights) => {

        // Calculate the total weight
        const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);

        // Generate a random value between 0 and totalWeight
        const randomValue = Math.random() * totalWeight;

        // Determine which index the random value falls into
        let cumulativeWeight = 0;
        for (let i = 0; i < weights.length; i++) {
            cumulativeWeight += weights[i];
            if (randomValue < cumulativeWeight) {
                return i + 1;
            }
        }
    }

    const dragStart = (event) => {
        const element = event.currentTarget; // The element being touched
        const rect = element.getBoundingClientRect(); // Get the element's position

        // Access the first touch point
        const touch = event.touches[0]; // Event.touches[0] is the first touch point
        const offsetX = touch.clientX - rect.left; // Calculate X offset
        const offsetY = touch.clientY - rect.top;  // Calculate Y offset

        setCornerTwo({ x: Math.floor(offsetX / TILE_SIZE), y: Math.floor(offsetY / TILE_SIZE) });
        setCornerOne({ x: Math.floor(offsetX / TILE_SIZE), y: Math.floor(offsetY / TILE_SIZE) });
    }

    const continueDrag = (event) => {
        const element = event.currentTarget; // The element being touched
        const rect = element.getBoundingClientRect(); // Get the element's position

        // Access the first touch point
        const touch = event.touches[0]; // Event.touches[0] is the first touch point
        const offsetX = touch.clientX - rect.left; // Calculate X offset
        const offsetY = touch.clientY - rect.top;  // Calculate Y offset

        setCornerTwo({ x: Math.floor(offsetX / TILE_SIZE), y: Math.floor(offsetY / TILE_SIZE) });

    }

    useEffect(() => {

        if (!cornerOne || !cornerTwo) {
            console.log(cornerOne, cornerTwo)
            setSelection({});

            return;
        }

        console.log({
            minX: Math.min(cornerOne.x, cornerTwo.x),
            minY: Math.min(cornerOne.y, cornerTwo.y),
            maxX: Math.min(BOARD_WIDTH - 1, Math.max(cornerOne.x, cornerTwo.x)),
            maxY: Math.min(BOARD_HEIGHT - 1, Math.max(cornerOne.y, cornerTwo.y)),
        });

        setSelection({
            minX: Math.min(cornerOne.x, cornerTwo.x),
            minY: Math.min(cornerOne.y, cornerTwo.y),
            maxX: Math.min(BOARD_WIDTH - 1, Math.max(cornerOne.x, cornerTwo.x)),
            maxY: Math.min(BOARD_HEIGHT - 1, Math.max(cornerOne.y, cornerTwo.y)),
        })


    }, [cornerOne, cornerTwo])

    const dragEnd = (event) => {
        const touch = event.changedTouches[0];

        // Get touch coordinates
        const touchX = touch.clientX;
        const touchY = touch.clientY;

        // Get element position
        const element = event.currentTarget; // The element being touched
        const rect = element.getBoundingClientRect();

        // Calculate relative position
        const relativeX = Math.floor((touchX - rect.left) / TILE_SIZE) + 1;
        const relativeY = Math.floor((touchY - rect.top) / TILE_SIZE) + 1;

        var minScoreX = 999;
        var minScoreY = 999;
        var maxScoreX = 0;
        var maxScoreY = 0;

        var total = board.reduce((tot, cur) => {
            if (cur.x >= selection.minX && cur.x <= selection.maxX &&
                cur.y >= selection.minY && cur.y <= selection.maxY) {

                if (cur.x <= minScoreX)
                    minScoreX = cur.x;
                if (cur.y <= minScoreY)
                    minScoreY = cur.y;
                if (cur.x > maxScoreX)
                    maxScoreX = cur.x;
                if (cur.y > maxScoreY)
                    maxScoreY = cur.y;

                return tot + cur.value;
            }
            return tot;
        }, 0);

        if (total == 10) {
            var newBoard = board.filter((cur) => {
                if (cur.x >= selection.minX && cur.x <= selection.maxX &&
                    cur.y >= selection.minY && cur.y <= selection.maxY) {
                    return false;
                }
                return true;
            });
            setBoard(newBoard);

            setScore(score + ((maxScoreY - minScoreY + 1) * (maxScoreX - minScoreX + 1)));
        }


        setCornerOne(null);
        setCornerTwo(null);

    }

    const generateBoard = () => {
        var newBoard = [];

        for (var i = 0; i < 12; i++) {
            for (var j = 0; j < 20; j++) {
                newBoard.push({
                    x: i,
                    y: j,
                    value: distMethod([1.2, 1.3, 1.25, 1.1, 1, 1, 1, .95, .90])
                })
            }
        }

        setBoard(newBoard);

    }

    useEffect(() => {
        generateBoard();
    }, [])

    return <div>
        <div className='font-chronotype text-[40px]'>Score: {score}</div>
        <div className={`relative ml-5`}
            style={{
                width: TILE_SIZE * BOARD_WIDTH,
                height: TILE_SIZE * BOARD_HEIGHT
            }}
            onTouchStart={(evt) => { dragStart(evt) }}
            onTouchMove={(evt) => { continueDrag(evt) }}
            onTouchEnd={(evt) => { dragEnd(evt) }}
        >
            {selection && selection.minX != undefined && (
                <div className='absolute border-2 border-[#f6dbc4]'
                    style={{
                        transition: "transition: width 0.125s ease, height 0.125s ease;",
                        width: (selection.maxX - selection.minX + 1) * TILE_SIZE,
                        height: (selection.maxY - selection.minY + 1) * TILE_SIZE,
                        left: selection.minX * TILE_SIZE,
                        top: selection.minY * TILE_SIZE
                    }}
                ></div>
            )}

            {
                board.map(tile => (
                    <div className={`absolute select-none font-chronotype text-center p-0 m-0 leading-[36px]`}

                        style={{ fontSize: "42px", left: tile.x * TILE_SIZE + "px", top: tile.y * TILE_SIZE + "px", width: TILE_SIZE, height: TILE_SIZE, color: PALETTE[tile.value - 1] }}>{tile.value}</div>
                ))
            }
        </div >
    </div>;
};

export default PlayScreen;