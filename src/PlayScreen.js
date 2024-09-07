import React, { useRef, useEffect, useState } from 'react';
import './TimerBar.css'; // Import your CSS for styling

const TILE_SIZE = 26;
const BOARD_WIDTH = 12;
const BOARD_HEIGHT = 20;
const TIMER_DURATION = 120000;

const PALETTE = ["#20463f", "#4149b1", "#9e3420", "#51473f", "#897769", "#f6dbc4", "#71c1c1", "#dbb54c", "#df9ee9"];

const PlayScreen = ({ gameOverCallback, isTouchDevice }) => {
    const [board, setBoard] = useState([]);
    const [selection, setSelection] = useState({});
    const [cornerOne, setCornerOne] = useState({});
    const [cornerTwo, setCornerTwo] = useState({});
    const [timerBarWidth, setTimerBarWidth] = useState('100%');
    const [startTime, setStartTime] = useState(Date.now())
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


    useEffect(() => {
        const endTime = startTime + TIMER_DURATION;
        const updateWidth = () => {
            const now = Date.now();
            const elapsedTime = now - startTime;
            const remainingTime = endTime - now;

            if (remainingTime <= 0) {
                setTimerBarWidth('0%');
                gameOverCallback(score);
            } else {
                const newWidth = (remainingTime / TIMER_DURATION) * 100;
                setTimerBarWidth(`${newWidth}%`);

                requestAnimationFrame(updateWidth);
            }
        };

        updateWidth();

    }, [score]);

    const getDragCoords = (event) => {
        const element = event.currentTarget; // The element being touched
        const rect = element.getBoundingClientRect(); // Get the element's position

        // Access the first touch point
        const touch = event.touches[0]; // Event.touches[0] is the first touch point
        const offsetX = touch.clientX - rect.left; // Calculate X offset
        const offsetY = touch.clientY - rect.top;  // Calculate Y offset
        return { offsetX, offsetY }
    }

    const mouseStart = (event) => {
        // Get the target element (the one where the event handler is attached)
        const target = event.currentTarget;

        // Get the element's bounding rectangle
        const rect = target.getBoundingClientRect();

        // Calculate the offset relative to the element's upper left corner
        const offsetX = event.clientX - rect.left;
        const offsetY = event.clientY - rect.top;

        dragStart(offsetX, offsetY);
    }

    const continueMouse = (event) => {
        // Get the target element (the one where the event handler is attached)
        const target = event.currentTarget;

        // Get the element's bounding rectangle
        const rect = target.getBoundingClientRect();

        // Calculate the offset relative to the element's upper left corner
        const offsetX = event.clientX - rect.left;
        const offsetY = event.clientY - rect.top;

        continueDrag(offsetX, offsetY);
    }

    const touchStart = (event) => {
        const { offsetX, offsetY } = getDragCoords(event);

        dragStart(offsetX, offsetY)
    }

    const continueTouch = (event) => {
        const { offsetX, offsetY } = getDragCoords(event);

        continueDrag(offsetX, offsetY)
    }

    const touchEnd = (event) => { dragEnd() }

    const dragStart = (offsetX, offsetY) => {
        setCornerTwo({ x: Math.floor(offsetX / TILE_SIZE), y: Math.floor(offsetY / TILE_SIZE) });
        setCornerOne({ x: Math.floor(offsetX / TILE_SIZE), y: Math.floor(offsetY / TILE_SIZE) });
    }

    const continueDrag = (offsetX, offsetY) => {
        setCornerTwo({ x: Math.floor(offsetX / TILE_SIZE), y: Math.floor(offsetY / TILE_SIZE) });
    }



    const dragEnd = () => {

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

            setScore(score + ((maxScoreY - minScoreY + 1) * (maxScoreX - minScoreX + 1) * (total / 10)));
        }

        setCornerOne(null);
        setCornerTwo(null);
    }

    useEffect(() => {

        if (!cornerOne || !cornerTwo) {
            setSelection({});

            return;
        }

        setSelection({
            minX: Math.min(cornerOne.x, cornerTwo.x),
            minY: Math.min(cornerOne.y, cornerTwo.y),
            maxX: Math.min(BOARD_WIDTH - 1, Math.max(cornerOne.x, cornerTwo.x)),
            maxY: Math.min(BOARD_HEIGHT - 1, Math.max(cornerOne.y, cornerTwo.y)),
        })


    }, [cornerOne, cornerTwo])


    const generateBoard = () => {
        var newBoard = [];

        for (var i = 0; i < 12; i++) {
            for (var j = 0; j < 20; j++) {
                newBoard.push({
                    x: i,
                    y: j,
                    value: distMethod([1.2, 1.3, 1.25, 1.1, 1, 1, .95, .9, .85])
                })
            }
        }

        setBoard(newBoard);

    }

    useEffect(() => {
        generateBoard();
    }, [])

    return <div className='mx-auto' style={{ width: TILE_SIZE * BOARD_WIDTH }}>
        <div className='font-chronotype text-[32px] leading-[20px]'>Score: {score}</div>
        <div className={`relative`}
            style={{
                width: TILE_SIZE * BOARD_WIDTH,
                height: TILE_SIZE * BOARD_HEIGHT
            }}
            onTouchStart={isTouchDevice ? touchStart : undefined}
            onTouchMove={isTouchDevice ? continueTouch : undefined}
            onTouchEnd={isTouchDevice ? touchEnd : undefined}
            onMouseDown={!isTouchDevice ? mouseStart : undefined}
            onMouseMove={!isTouchDevice ? continueMouse : undefined}
            onMouseUp={!isTouchDevice ? touchEnd : undefined}

        >
            {selection && selection.minX != undefined && !isNaN(selection.minX) && (
                <div className='absolute border-2 border-[#f6dbc4]'
                    style={{
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

        <div className="timer-bar-container mt-3">
            <div className="timer-bar" style={{ width: timerBarWidth }}></div>
        </div>
    </div>
};

export default PlayScreen;