/**
 * Chess Game Application
 * Main app file that handles the UI and game logic
 */

// Global variables
let board = null;
let game = new Chess();
let engine = new ChessEngine(2); // Default medium difficulty
let hpSystem = new HPSystem(); // Initialize HP system
let $status = $('#status');
let $fen = $('#fen');
let $pgn = $('#pgn');
let squareToHighlight = null;
let isThinking = false;
let pendingCapture = null; // Stores info about a piece that's been hit but not fully captured

// Initialize the game
function initGame() {
    // Initialize the chessboard UI
    const config = {
        draggable: true,
        position: 'start',
        pieceTheme: 'https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png',
        onDragStart: onDragStart,
        onDrop: onDrop,
        onMouseoutSquare: onMouseoutSquare,
        onMouseoverSquare: onMouseoverSquare,
        onSnapEnd: onSnapEnd
    };
    
    board = Chessboard('board', config);
    
    // Set engine difficulty based on dropdown
    const difficultyLevel = parseInt($('#difficulty').val(), 10);
    engine.setDifficulty(difficultyLevel);
    
    // Add event listeners
    $('#newGameBtn').on('click', newGame);
    $('#undoBtn').on('click', undoMove);
    $('#difficulty').on('change', function() {
        const difficultyLevel = parseInt($(this).val(), 10);
        engine.setDifficulty(difficultyLevel);
    });
    
    updateStatus();
    
    // Update HP display
    setTimeout(function() {
        hpSystem.updateBoardDisplay();
    }, 100);
    
    // Add resize handling
    $(window).resize(function() {
        board.resize();
        setTimeout(function() {
            hpSystem.updateBoardDisplay();
        }, 100);
    });
}

// Start a new game
function newGame() {
    game = new Chess();
    board.position('start');
    
    // Reset HP system
    hpSystem.resetGame();
    pendingCapture = null;
    
    // Reset highlights
    $status.removeClass('check checkmate stalemate draw');
    squareToHighlight = null;
    
    updateStatus();
    
    // Update HP display
    setTimeout(function() {
        hpSystem.updateBoardDisplay();
    }, 100);
}

// Handle the start of a piece drag
function onDragStart(source, piece, position, orientation) {
    // Don't allow drag if the game is over or it's not the player's turn
    if (game.game_over() || isThinking ||
        (game.turn() === 'w' && piece.search(/^b/) !== -1) ||
        (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
        return false;
    }
}

// Handle square mouseover for move highlighting
function onMouseoverSquare(square, piece) {
    // Get list of possible moves for this square
    const moves = game.moves({
        square: square,
        verbose: true
    });
    
    // Exit if there are no moves available for this square
    if (moves.length === 0) return;
    
    // Highlight the square
    greySquare(square);
    
    // Highlight the possible moves
    for (let i = 0; i < moves.length; i++) {
        greySquare(moves[i].to);
    }
}

// Handle square mouseout to clear highlights
function onMouseoutSquare(square, piece) {
    removeGreySquares();
}

// Handle the piece drop on a square
function onDrop(source, target) {
    // Remove any highlights
    removeGreySquares();
    
    // Get the move details without executing it yet
    const moveDetails = game.move({
        from: source,
        to: target,
        promotion: 'q' // Always promote to a queen for simplicity
    });
    
    // If illegal move, reset the position
    if (moveDetails === null) return 'snapback';
    
    // Check if this is a capture move
    if (moveDetails.captured) {
        // Process the move through the HP system
        const captureCompleted = hpSystem.handleMove(moveDetails, game);
        
        // If the piece wasn't fully captured (HP > 0)
        if (!captureCompleted) {
            pendingCapture = {
                target: target,
                piece: moveDetails.captured
            };
            
            // We need to undo the chess.js move since the capture wasn't completed
            game.undo();
            
            // But we'll keep the visual position with the attacking piece on the target square
            // This represents the battle in progress
        } else {
            pendingCapture = null;
        }
    } else {
        // Normal move (non-capture)
        hpSystem.handleMove(moveDetails, game);
        pendingCapture = null;
    }
    
    // Highlight the last move
    highlightLastMove(moveDetails);
    
    // Update the game status
    updateStatus();
    
    // Update HP display
    hpSystem.updateBoardDisplay();
    
    // Let the computer play if the game isn't over
    if (!game.game_over()) {
        setTimeout(makeComputerMove, 250);
    }
}

// Function to have the computer make a move
function makeComputerMove() {
    isThinking = true;
    
    // Add a "thinking" indicator
    $status.append(' <span class="spinner"></span>');
    
    // Use a timeout to allow for visual feedback that the AI is "thinking"
    setTimeout(function() {
        // Find the best move with the chess engine
        const move = engine.findBestMove(game);
        
        if (move) {
            const moveObj = game.move(move);
            
            // Process the move through the HP system
            if (moveObj.captured) {
                const captureCompleted = hpSystem.handleMove(moveObj, game);
                
                // If the piece wasn't fully captured (HP > 0)
                if (!captureCompleted) {
                    pendingCapture = {
                        target: moveObj.to,
                        piece: moveObj.captured
                    };
                    
                    // We need to undo the chess.js move since the capture wasn't completed
                    game.undo();
                } else {
                    pendingCapture = null;
                }
            } else {
                // Normal move (non-capture)
                hpSystem.handleMove(moveObj, game);
                pendingCapture = null;
            }
            
            board.position(game.fen());
            
            // Highlight the last move
            highlightLastMove(moveObj);
            
            // Update HP display
            hpSystem.updateBoardDisplay();
            
            updateStatus();
        }
        
        isThinking = false;
        $('.spinner').remove(); // Remove thinking indicator
    }, 500); // Small delay to simulate thinking
}

// Update board position after piece snap animation completes
function onSnapEnd() {
    board.position(game.fen());
    
    // Update HP display after the board updates
    setTimeout(function() {
        hpSystem.updateBoardDisplay();
    }, 100);
}

// Undo the last two moves (player and computer)
function undoMove() {
    if (isThinking) return;
    
    // Clear any pending captures
    pendingCapture = null;
    
    // Undo two moves to get back to the player's turn
    if (game.history().length >= 2) {
        game.undo(); // Undo computer move
        game.undo(); // Undo player move
        
        // Reset HP system to match the current position
        hpSystem.initializeFromFen(game.fen());
        
        board.position(game.fen());
        
        // Get the last move after undo (if any) and highlight it
        if (game.history().length > 0) {
            const moveObj = game.history({verbose: true})[game.history().length - 1];
            highlightLastMove(moveObj);
        } else {
            squareToHighlight = null;
            $('#board .square-55d63').removeClass('highlight-square highlight-check');
        }
        
        updateStatus();
        
        // Update HP display
        hpSystem.updateBoardDisplay();
    } else if (game.history().length === 1) {
        // If only one move made, undo that
        game.undo();
        
        // Reset HP system to match the current position
        hpSystem.initializeFromFen(game.fen());
        
        board.position(game.fen());
        squareToHighlight = null;
        $('#board .square-55d63').removeClass('highlight-square highlight-check');
        updateStatus();
        
        // Update HP display
        hpSystem.updateBoardDisplay();
    }
}

// Update the game status information
function updateStatus() {
    let status = '';
    $status.removeClass('check checkmate stalemate draw');
    
    // If there's a pending capture, add that information
    if (pendingCapture) {
        status = `${game.turn() === 'b' ? 'Black' : 'White'} attacking ${pendingCapture.piece} (HP: ${hpSystem.getHP(pendingCapture.target)})`;
    }
    // Check if the game is over
    else if (game.game_over()) {
        if (game.in_checkmate()) {
            status = `Game over, ${game.turn() === 'b' ? 'Black' : 'White'} is in checkmate.`;
            $status.addClass('checkmate');
        } else if (game.in_draw()) {
            status = 'Game over, drawn position';
            $status.addClass('draw');
            if (game.in_stalemate()) {
                status = `Game over, ${game.turn() === 'b' ? 'Black' : 'White'} is in stalemate.`;
                $status.addClass('stalemate');
            } else if (game.in_threefold_repetition()) {
                status = 'Game over, drawn by threefold repetition.';
            } else if (game.insufficient_material()) {
                status = 'Game over, drawn due to insufficient material.';
            } else {
                status = 'Game over, drawn by the 50-move rule.';
            }
        }
    } 
    // Game still in progress
    else {
        status = (game.turn() === 'b' ? 'Black' : 'White') + ' to move';
        
        // Check?
        if (game.in_check()) {
            status += ', ' + (game.turn() === 'b' ? 'Black' : 'White') + ' is in check';
            $status.addClass('check');
            
            // Highlight the king that's in check
            highlightCheck(game.turn());
        }
    }
    
    // Update the status display
    $status.html(status);
    
    // Update FEN and PGN displays
    $fen.html(game.fen());
    $pgn.html(game.pgn({ max_width: 5, newline_char: '<br />' }));
}

// Highlight the king that's in check
function highlightCheck(color) {
    $('#board .square-55d63').removeClass('highlight-check');
    
    // Find the king's position
    const board = game.board();
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const piece = board[i][j];
            if (piece && piece.type === 'k' && piece.color === color[0]) {
                const square = String.fromCharCode(97 + j) + (8 - i);
                $(`#board .square-${square}`).addClass('highlight-check');
                return;
            }
        }
    }
}

// Highlight the last move made
function highlightLastMove(move) {
    $('#board .square-55d63').removeClass('highlight-square');
    
    // Highlight the from and to squares
    $(`#board .square-${move.from}`).addClass('highlight-square');
    $(`#board .square-${move.to}`).addClass('highlight-square');
    
    squareToHighlight = move.to;
}

// Add grey square highlights for possible moves
function greySquare(square) {
    const $square = $('#board .square-' + square);
    
    $square.addClass('highlight-square');
}

// Remove grey square highlights
function removeGreySquares() {
    $('#board .square-55d63').removeClass('highlight-square');
    
    // Reapply highlighting to the last move squares if needed
    if (squareToHighlight) {
        const history = game.history({verbose: true});
        if (history.length > 0) {
            const lastMove = history[history.length - 1];
            $(`#board .square-${lastMove.from}`).addClass('highlight-square');
            $(`#board .square-${lastMove.to}`).addClass('highlight-square');
        }
    }
}

// Initialize the game when the DOM is ready
$(document).ready(function() {
    initGame();
}); 