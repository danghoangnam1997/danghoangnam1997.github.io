/**
 * Chess Engine
 * A simple chess AI implementation that uses minimax algorithm with alpha-beta pruning
 */

class ChessEngine {
    constructor(depth = 2) {
        this.depth = depth;
        this.positionCount = 0;
        
        // Piece values for evaluation
        this.pieceValues = {
            'p': 100,
            'n': 320,
            'b': 330,
            'r': 500,
            'q': 900,
            'k': 20000
        };
        
        // Position bonus tables for improved piece placement evaluation
        this.pawnEvalWhite = [
            [0,  0,  0,  0,  0,  0,  0,  0],
            [50, 50, 50, 50, 50, 50, 50, 50],
            [10, 10, 20, 30, 30, 20, 10, 10],
            [5,  5, 10, 25, 25, 10,  5,  5],
            [0,  0,  0, 20, 20,  0,  0,  0],
            [5, -5,-10,  0,  0,-10, -5,  5],
            [5, 10, 10,-20,-20, 10, 10,  5],
            [0,  0,  0,  0,  0,  0,  0,  0]
        ];
        
        this.knightEval = [
            [-50,-40,-30,-30,-30,-30,-40,-50],
            [-40,-20,  0,  0,  0,  0,-20,-40],
            [-30,  0, 10, 15, 15, 10,  0,-30],
            [-30,  5, 15, 20, 20, 15,  5,-30],
            [-30,  0, 15, 20, 20, 15,  0,-30],
            [-30,  5, 10, 15, 15, 10,  5,-30],
            [-40,-20,  0,  5,  5,  0,-20,-40],
            [-50,-40,-30,-30,-30,-30,-40,-50]
        ];
        
        this.bishopEvalWhite = [
            [-20,-10,-10,-10,-10,-10,-10,-20],
            [-10,  0,  0,  0,  0,  0,  0,-10],
            [-10, 10, 10, 10, 10, 10, 10,-10],
            [-10,  0, 10, 10, 10, 10,  0,-10],
            [-10,  5,  5, 10, 10,  5,  5,-10],
            [-10,  0,  5, 10, 10,  5,  0,-10],
            [-10,  0,  0,  0,  0,  0,  0,-10],
            [-20,-10,-10,-10,-10,-10,-10,-20]
        ];
        
        this.rookEvalWhite = [
            [0,  0,  0,  0,  0,  0,  0,  0],
            [5, 10, 10, 10, 10, 10, 10,  5],
            [-5,  0,  0,  0,  0,  0,  0, -5],
            [-5,  0,  0,  0,  0,  0,  0, -5],
            [-5,  0,  0,  0,  0,  0,  0, -5],
            [-5,  0,  0,  0,  0,  0,  0, -5],
            [-5,  0,  0,  0,  0,  0,  0, -5],
            [0,  0,  0,  5,  5,  0,  0,  0]
        ];
        
        this.queenEval = [
            [-20,-10,-10, -5, -5,-10,-10,-20],
            [-10,  0,  0,  0,  0,  0,  0,-10],
            [-10,  0,  5,  5,  5,  5,  0,-10],
            [-5,  0,  5,  5,  5,  5,  0, -5],
            [0,  0,  5,  5,  5,  5,  0, -5],
            [-10,  5,  5,  5,  5,  5,  0,-10],
            [-10,  0,  5,  0,  0,  0,  0,-10],
            [-20,-10,-10, -5, -5,-10,-10,-20]
        ];
        
        this.kingEvalWhite = [
            [-30,-40,-40,-50,-50,-40,-40,-30],
            [-30,-40,-40,-50,-50,-40,-40,-30],
            [-30,-40,-40,-50,-50,-40,-40,-30],
            [-30,-40,-40,-50,-50,-40,-40,-30],
            [-20,-30,-30,-40,-40,-30,-30,-20],
            [-10,-20,-20,-20,-20,-20,-20,-10],
            [20, 20,  0,  0,  0,  0, 20, 20],
            [20, 30, 10,  0,  0, 10, 30, 20]
        ];
        
        // Reversed tables for black pieces
        this.pawnEvalBlack = this.reverseArray(this.pawnEvalWhite);
        this.bishopEvalBlack = this.reverseArray(this.bishopEvalWhite);
        this.rookEvalBlack = this.reverseArray(this.rookEvalWhite);
        this.kingEvalBlack = this.reverseArray(this.kingEvalWhite);
    }
    
    // Helper function to reverse arrays for black piece evaluations
    reverseArray(array) {
        return array.slice().reverse();
    }
    
    // Set the AI difficulty (search depth)
    setDifficulty(difficulty) {
        // 1 = Easy, 2 = Medium, 3 = Hard
        this.depth = difficulty;
    }
    
    // Main function to find the best move
    findBestMove(game) {
        this.positionCount = 0;
        const depth = this.depth;
        
        // For easy difficulty, sometimes make a random legal move
        if (this.depth === 1 && Math.random() < 0.3) {
            const moves = game.moves();
            return moves[Math.floor(Math.random() * moves.length)];
        }
        
        let bestMove = null;
        let bestValue = -Infinity;
        let alpha = -Infinity;
        let beta = Infinity;
        
        // Get all possible moves
        const moves = game.moves();
        
        // Sort moves to improve alpha-beta pruning efficiency (captures first)
        moves.sort((a, b) => {
            if (a.indexOf('x') !== -1 && b.indexOf('x') === -1) return -1;
            if (a.indexOf('x') === -1 && b.indexOf('x') !== -1) return 1;
            return 0;
        });
        
        // Evaluate each move
        for (let i = 0; i < moves.length; i++) {
            const move = moves[i];
            
            // Make the move
            game.move(move);
            
            // Evaluate position after move
            const value = -this.minimax(game, depth - 1, -beta, -alpha, false);
            
            // Undo the move
            game.undo();
            
            this.positionCount++;
            
            // Update best move if this one is better
            if (value > bestValue) {
                bestValue = value;
                bestMove = move;
            }
            
            // Update alpha
            alpha = Math.max(alpha, value);
        }
        
        console.log(`AI evaluated ${this.positionCount} positions`);
        return bestMove;
    }
    
    // Minimax algorithm with alpha-beta pruning
    minimax(game, depth, alpha, beta, isMaximizingPlayer) {
        this.positionCount++;
        
        // Terminal conditions
        if (depth === 0) {
            return this.evaluateBoard(game.board());
        }
        
        if (game.game_over()) {
            if (game.in_draw()) {
                return 0;
            } else {
                // If checkmate, return highly negative/positive score based on player
                return isMaximizingPlayer ? -20000 : 20000;
            }
        }
        
        // Get all possible moves
        const moves = game.moves();
        
        // Sort moves - captures first for more efficient pruning
        moves.sort((a, b) => {
            if (a.indexOf('x') !== -1 && b.indexOf('x') === -1) return -1;
            if (a.indexOf('x') === -1 && b.indexOf('x') !== -1) return 1;
            return 0;
        });
        
        // Maximizing player (AI)
        if (isMaximizingPlayer) {
            let bestValue = -Infinity;
            
            for (let i = 0; i < moves.length; i++) {
                game.move(moves[i]);
                bestValue = Math.max(bestValue, this.minimax(game, depth - 1, alpha, beta, !isMaximizingPlayer));
                game.undo();
                
                alpha = Math.max(alpha, bestValue);
                if (beta <= alpha) {
                    break; // Beta cutoff
                }
            }
            
            return bestValue;
        } 
        // Minimizing player (human)
        else {
            let bestValue = Infinity;
            
            for (let i = 0; i < moves.length; i++) {
                game.move(moves[i]);
                bestValue = Math.min(bestValue, this.minimax(game, depth - 1, alpha, beta, !isMaximizingPlayer));
                game.undo();
                
                beta = Math.min(beta, bestValue);
                if (beta <= alpha) {
                    break; // Alpha cutoff
                }
            }
            
            return bestValue;
        }
    }
    
    // Board evaluation function
    evaluateBoard(board) {
        let totalEvaluation = 0;
        
        // Evaluate each piece on the board
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                totalEvaluation += this.evaluatePiece(board[i][j], i, j);
            }
        }
        
        return totalEvaluation;
    }
    
    // Evaluate the value of a single piece
    evaluatePiece(piece, row, col) {
        if (piece === null) {
            return 0;
        }
        
        // Get piece type and color
        const pieceType = piece.type;
        const pieceColor = piece.color;
        
        // Base value from piece type
        let absoluteValue = this.getPieceValue(piece, row, col);
        
        return pieceColor === 'w' ? absoluteValue : -absoluteValue;
    }
    
    // Get the value of a piece including position bonus
    getPieceValue(piece, row, col) {
        const pieceType = piece.type;
        const pieceColor = piece.color;
        
        // Base material value
        let value = this.pieceValues[pieceType];
        
        // Add position bonus based on piece type and color
        if (pieceType === 'p') {
            value += (pieceColor === 'w' ? this.pawnEvalWhite[row][col] : this.pawnEvalBlack[row][col]);
        } else if (pieceType === 'n') {
            value += this.knightEval[row][col];
        } else if (pieceType === 'b') {
            value += (pieceColor === 'w' ? this.bishopEvalWhite[row][col] : this.bishopEvalBlack[row][col]);
        } else if (pieceType === 'r') {
            value += (pieceColor === 'w' ? this.rookEvalWhite[row][col] : this.rookEvalBlack[row][col]);
        } else if (pieceType === 'q') {
            value += this.queenEval[row][col];
        } else if (pieceType === 'k') {
            value += (pieceColor === 'w' ? this.kingEvalWhite[row][col] : this.kingEvalBlack[row][col]);
        }
        
        return value;
    }
} 