/**
 * HP System for Chess Pieces
 * Tracks and manages hit points for chess pieces
 */

class HPSystem {
    constructor() {
        // Initialize HP values for each piece type
        this.initialHP = {
            'p': 1, // pawn
            'n': 2, // knight
            'b': 2, // bishop
            'r': 2, // rook
            'q': 3, // queen
            'k': 1  // king
        };
        
        // Store current HP values for all pieces on the board
        // Format: { square: hp }
        this.pieceHP = {};
        
        // Initialize from starting position
        this.initializeFromFen('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR');
    }
    
    // Initialize HP values for a given FEN position
    initializeFromFen(fen) {
        this.pieceHP = {};
        
        const fenParts = fen.split(' ')[0];
        const rows = fenParts.split('/');
        
        let rank = 0;
        for (const row of rows) {
            let file = 0;
            for (const char of row) {
                if (isNaN(char)) {
                    // This is a piece
                    const square = String.fromCharCode(97 + file) + (8 - rank);
                    const pieceType = char.toLowerCase();
                    this.pieceHP[square] = this.initialHP[pieceType];
                    file++;
                } else {
                    // This is a number, representing empty squares
                    file += parseInt(char);
                }
            }
            rank++;
        }
    }
    
    // Reset HP values for a new game
    resetGame() {
        this.initializeFromFen('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR');
    }
    
    // Get HP for a piece at a given square
    getHP(square) {
        return this.pieceHP[square] || 0;
    }
    
    // Set HP for a piece at a given square
    setHP(square, hp) {
        this.pieceHP[square] = hp;
    }
    
    // Handle a piece move
    handleMove(move, game) {
        const { from, to, captured } = move;
        
        // Move the HP value from source to destination
        if (from in this.pieceHP) {
            this.pieceHP[to] = this.pieceHP[from];
            delete this.pieceHP[from];
        }
        
        // If this was a capture, decrease HP of captured piece
        if (captured && to in this.pieceHP) {
            this.pieceHP[to]--;
            
            // If HP is now 0, piece is fully captured
            if (this.pieceHP[to] <= 0) {
                return true; // Capture completed
            } else {
                return false; // Piece not fully captured yet
            }
        }
        
        return true; // Move completed normally
    }
    
    // Update the board display with HP values
    updateBoardDisplay() {
        // Remove existing HP displays
        $('.hp-display').remove();
        
        // Add HP displays for each piece
        for (const square in this.pieceHP) {
            const hp = this.pieceHP[square];
            if (hp > 0) {
                const $square = $(`.square-${square}`);
                const $hpDisplay = $('<div>').addClass('hp-display').text(hp);
                $square.append($hpDisplay);
            }
        }
    }
} 