(function() {
    // PS5 DualSense button mapping
    const buttonMap = {
        0: 32,  // Cross → Jump (Space)
        1: 17,  // Circle → Sneak (Ctrl)
        2: 69,  // Square → Inventory (E)
        3: 81,  // Triangle → Drop (Q)
        4: 16,  // L1 → Sprint (Shift)
        5: 1,   // R1 → Attack/use
        6: 1,   // L2 → Secondary attack (same as R2)
        7: 2,   // R2 → Use block
        8: 27,  // Create → Escape/Menu
        9: 13,  // Options → Enter
        10: 20, // L3 → Optional
        11: 21  // R3 → Optional
    };

    const pressed = {};

    // Function to simulate key press/release
    function sendKey(keyCode, type) {
        const event = new KeyboardEvent(type, { keyCode: keyCode, bubbles: true });
        document.dispatchEvent(event);
    }

    // Main gamepad loop
    function updateGamepad() {
        const gp = navigator.getGamepads()[0]; // first controller
        if (!gp) return requestAnimationFrame(updateGamepad);

        // Buttons
        gp.buttons.forEach((b, i) => {
            if (b.pressed && !pressed[i]) {
                pressed[i] = true;
                if (buttonMap[i]) sendKey(buttonMap[i], 'keydown');
            } else if (!b.pressed && pressed[i]) {
                pressed[i] = false;
                if (buttonMap[i]) sendKey(buttonMap[i], 'keyup');
            }
        });

        // Left stick → WASD movement
        const threshold = 0.3;
        const [lx, ly] = [gp.axes[0], gp.axes[1]];
        if (ly < -threshold) sendKey(87, 'keydown'); else sendKey(87, 'keyup'); // W
        if (ly > threshold) sendKey(83, 'keydown'); else sendKey(83, 'keyup');  // S
        if (lx < -threshold) sendKey(65, 'keydown'); else sendKey(65, 'keyup'); // A
        if (lx > threshold) sendKey(68, 'keydown'); else sendKey(68, 'keyup');  // D

        // Right stick → camera (mouse movement)
        const [rx, ry] = [gp.axes[2], gp.axes[3]];
        if (Math.abs(rx) > 0.1 || Math.abs(ry) > 0.1) {
            const evt = new MouseEvent('mousemove', {
                movementX: rx * 5,  // adjust sensitivity
                movementY: ry * 5,
                bubbles: true
            });
            document.dispatchEvent(evt);
        }

        requestAnimationFrame(updateGamepad);
    }

    // Detect gamepad connection
    window.addEventListener("gamepadconnected", e => {
        console.log("PS5 Controller connected:", e.gamepad.id);
        requestAnimationFrame(updateGamepad);
    });

})();
