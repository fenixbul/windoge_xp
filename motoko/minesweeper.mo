import Random "mo:base/Random";
import Int "mo:base/Int";
import Debug "mo:base/Debug";
import Iter "mo:base/Iter";
import Array "mo:base/Array";
import Trie "mo:base/Trie";
import Hash "mo:base/Hash";

actor Minesweeper {

  // Generate 5 boards
  // Asign board to user
    // Generate new board if asigned
  // Remove board from user
  // User board history
    // Duration
    // Win Wose (divided by levels)
    // User points

  var random : ?Random.Finite = null;

  type Grid = [Int];
  type MineTrie = Trie.Trie<Nat, Bool>;

  var boardGrid : [var Int] = Array.tabulateVar<Int>(0, func i = i);
  var boardMines = Trie.empty<Nat, Bool>();

  // Configuration for different game levels
  let Config = {
    Beginner = {
      rows : Int = 9;
      columns : Int = 9;
      ceils : Int = 81;
      mines : Int = 10;
    };
    Intermediate = {
      rows : Int = 16;
      columns : Int = 16;
      ceils : Int = 256;
      mines : Int = 40;
    };
    Expert = {
      rows : Int = 16;
      columns : Int = 30;
      ceils : Int = 480;
      mines : Int = 99;
    };
  };

  // Function to select a random value within the range
  private shared func selectRandomCell(maxValue : Nat) : async ?Nat {
    switch (random) {
      case (null) {
        random := ?Random.Finite(await Random.blob());
      };
      case (_) {};
    };

    switch (random) {
      case (null) {
        random := ?Random.Finite(await Random.blob());
        return null;
      };
      case (?randomNotNull) {
        let randomValue = randomNotNull.range(10);
        switch (randomValue) {
          case (null) {
            random := ?Random.Finite(await Random.blob());
            let randomValue2 = randomNotNull.range(10);
            switch (randomValue2) {
              case (null) {
                return null;
              };
              case (?value2) {
                return ?(value2 % maxValue);
              }
            }
          };
          case (?value) {
            return ?(value % maxValue);
          }
        }
      };
    };
  };

  // Function to generate a unique key for the trie (a key is a record with a hash)
  func key(n: Nat): Trie.Key<Nat> {
      { hash = Hash.hash(n); key = n };
  };

  // Generate the initial board with the specified config
  private func generateBoard(config : { rows : Int; columns : Int; mines : Int }) : async Grid {
    // Create an immutable array for the grid with all cells initialized to 0 (empty)
    let totalCells = config.rows * config.columns;
    var grid = Array.tabulateVar<Int>(Int.abs(totalCells), func _ = 0);

    var mineTrie: MineTrie = Trie.empty<Nat, Bool>();
    var minesPlaced = 0;

    // Helper function for equality check
    let eq = func (a: Nat, b: Nat): Bool { a == b };

    // Keep placing mines until we reach numMines
    while (minesPlaced < config.mines) {
      let randomPos = await selectRandomCell(Int.abs(totalCells));

      switch(randomPos) {
        case(null) {};
        case(?pos) {
            // Check if the position already has a mine in the trie
            if (Trie.get(mineTrie, key(pos), eq) == null) {
              // Place the mine
                grid[pos] := -1;

                // Add the position to the trie of placed mines
                mineTrie := Trie.put(mineTrie, key(pos), eq, true).0;

                // Increment the count of placed mines
                minesPlaced := minesPlaced + 1;
            }
        };
      };
    };

    boardGrid := grid;
    boardMines := mineTrie;

    return Array.freeze(grid); 
  };

  public func getBoardGrid() : async Grid {
    return Array.freeze(boardGrid);
  };

  // Function to check if a given index contains a mine
  public func isMine(index: Nat) : async Bool {
    let eq = func (a: Nat, b: Nat): Bool { a == b };
    switch (Trie.get(boardMines, key(index), eq)) {
      case (?isMine) { return isMine; };
      case null { return false };
    };
  };

  // Helper function to calculate neighbors of a cell
  private func getNeighbors(index: Nat, rows: Nat, cols: Nat) : [Nat] {
    let row = index / cols;
    let col = index % cols;

    // Collect all valid neighbors, ensuring we don't go out of bounds
    var neighbors: [Nat] = [];

    // Left neighbor (if not in the first column)
    if (col > 0) {
      neighbors := Array.append(neighbors, [row * cols + (col - 1)]);
    };

    // Right neighbor (if not in the last column)
    if (col < cols - 1) {
      neighbors := Array.append(neighbors, [row * cols + (col + 1)]);
    };

    // Top neighbor (if not in the first row)
    if (row > 0) {
      neighbors := Array.append(neighbors, [(row - 1) * cols + col]);
    };

    // Bottom neighbor (if not in the last row)
    if (row < rows - 1) {
      neighbors := Array.append(neighbors, [(row + 1) * cols + col]);
    };

    // Top-left neighbor
    if (row > 0 and col > 0) {
      neighbors := Array.append(neighbors, [(row - 1) * cols + (col - 1)]);
    };

    // Top-right neighbor
    if (row > 0 and col < cols - 1) {
      neighbors := Array.append(neighbors, [(row - 1) * cols + (col + 1)]);
    };

    // Bottom-left neighbor
    if (row < rows - 1 and col > 0) {
      neighbors := Array.append(neighbors, [(row + 1) * cols + (col - 1)]);
    };

    // Bottom-right neighbor
    if (row < rows - 1 and col < cols - 1) {
      neighbors := Array.append(neighbors, [(row + 1) * cols + (col + 1)]);
    };

    return neighbors;
  };

  // Function to update the board with mine neighbor counts
  private func calculateMineCounts(config: { rows : Int; columns : Int }) : async () {
    // Helper function for equality check
    let eq = func (a: Nat, b: Nat): Bool { a == b };

    // Iterate through all mines in the trie using Trie.iter
    for (entry in Trie.iter(boardMines)) {
      let (key, _) = entry;
      let pos = key;

      // Get all valid neighbors of this mine
      let neighbors = getNeighbors(pos, Int.abs(config.rows), Int.abs(config.columns));

      // Increment neighbor cells that are not mines
      for (neighbor in neighbors.vals()) {
        if (Trie.get(boardMines, {hash = Hash.hash(neighbor); key = neighbor}, eq) == null) {
          boardGrid[neighbor] := boardGrid[neighbor] + 1;
        }
      }
    }
  };

  // Function to open a cell at the given index
  public shared func openCell(index: Nat) : async [Nat] {
    let rows = Int.abs(Config.Beginner.rows);
    let cols = Int.abs(Config.Beginner.columns);

    // If the selected cell is a mine, handle it accordingly
    let isMineResult = await isMine(index);
    if (isMineResult) {
      Debug.print("Mine triggered! Game over.");  // Placeholder for handling game-over logic
      return []; // Or handle the game-over logic
    };

    // If not a mine, walk through the board and reveal neighboring cells
    var walkedCeils: [var Bool] = Array.tabulateVar<Bool>(boardGrid.size(), func _ = false);

    func walkCeils(currentIndex: Nat) : [Nat] {
      if (walkedCeils[currentIndex]) {
        return []; // If already walked, return an empty array
      };
      
      walkedCeils[currentIndex] := true;  // Mark as walked

      // Check if the current cell has neighboring mines (if it's greater than 0, stop further recursion)
      if (boardGrid[currentIndex] > 0) {
        return [currentIndex];  // Reveal only this cell if it has mines around it
      };

      // If no mines around, reveal all adjacent cells recursively
      let neighbors = getNeighbors(currentIndex, rows, cols);
      var revealedCells: [Nat] = [currentIndex];  // Start with the current cell

      // Recursively reveal all neighbors
      for (neighbor in neighbors.vals()) {
        if (not walkedCeils[neighbor]) {
          revealedCells := Array.append(revealedCells, walkCeils(neighbor));
        };
      };

      return revealedCells;
    };

    return walkCeils(index);
  };

  // Example usage:
  public shared func startGame() : async Grid {
    let beginnerBoardResponse = await generateBoard(Config.Beginner);
    
    await calculateMineCounts(Config.Beginner);

    return beginnerBoardResponse;
  };
};
