/**
 * Chess Game Application
 * Main app file that handles the UI and game logic
 */

// Global variables
let board = null;
let game = new Chess();
let engine = new ChessEngine(2); // Default medium difficulty
let $status = $('#status');
let $fen = $('#fen');
let $pgn = $('#pgn');
let squareToHighlight = null;
let isThinking = false;

// Initialize the game
function initGame() {
    // Initialize the chessboard UI
    const config = {
        draggable: true,
        position: 'start',
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
    
    // Add resize handling
    $(window).resize(function() {
        board.resize();
    });
}

// Start a new game
function newGame() {
    game = new Chess();
    board.position('start');
    
    // Reset highlights
    $status.removeClass('check checkmate stalemate draw');
    squareToHighlight = null;
    
    updateStatus();
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
    
    // Attempt the move
    const move = game.move({
        from: source,
        to: target,
        promotion: 'q' // Always promote to a queen for simplicity
    });
    
    // If illegal move, reset the position
    if (move === null) return 'snapback';
    
    // Highlight the last move
    highlightLastMove(move);
    
    // Update the game status
    updateStatus();
    
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
            game.move(move);
            board.position(game.fen());
            
            // Highlight the last move
            const moveObj = game.history({verbose: true})[game.history().length - 1];
            highlightLastMove(moveObj);
            
            updateStatus();
        }
        
        isThinking = false;
        $('.spinner').remove(); // Remove thinking indicator
    }, 500); // Small delay to simulate thinking
}

// Update board position after piece snap animation completes
function onSnapEnd() {
    board.position(game.fen());
}

// Undo the last two moves (player and computer)
function undoMove() {
    if (isThinking) return;
    
    // Undo two moves to get back to the player's turn
    if (game.history().length >= 2) {
        game.undo(); // Undo computer move
        game.undo(); // Undo player move
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
    } else if (game.history().length === 1) {
        // If only one move made, undo that
        game.undo();
        board.position(game.fen());
        squareToHighlight = null;
        $('#board .square-55d63').removeClass('highlight-square highlight-check');
        updateStatus();
    }
}

// Update the game status information
function updateStatus() {
    let status = '';
    $status.removeClass('check checkmate stalemate draw');
    
    // Get the game status
    let moveColor = game.turn() === 'b' ? 'Black' : 'White';
    
    // Check if the game is over
    if (game.game_over()) {
        if (game.in_checkmate()) {
            status = `Game over, ${moveColor} is in checkmate.`;
            $status.addClass('checkmate');
        } else if (game.in_draw()) {
            status = 'Game over, drawn position';
            $status.addClass('draw');
            if (game.in_stalemate()) {
                status = `Game over, ${moveColor} is in stalemate.`;
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
        status = moveColor + ' to move';
        
        // Check?
        if (game.in_check()) {
            status += ', ' + moveColor + ' is in check';
            $status.addClass('check');
            
            // Highlight the king that's in check
            highlightCheck(moveColor.toLowerCase());
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