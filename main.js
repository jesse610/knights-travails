const Queue = function() {
    this.items = [];
};

Queue.prototype.enqueue = function(obj) {
    this.items.push(obj);
};
Queue.prototype.dequeue = function() {
    return this.items.shift();
};
Queue.prototype.isEmpty = function() {
    return this.items.length === 0;
};

class Game {
    createGameboard = () => {
        let gamboard = []
        for(let i = 0; i < 8; i++)
        {
            const row = []
            for(let j = 0; j < 8; j++)
            {
                row.push('0')
            }
            gamboard.push(row)
        }

        return gamboard
    }

    createKnight = () => {
        return {marker: 'K'}
    }

    knightMoves = (src, endPoint) => {
        const board = this.createGameboard()
        const knight = this.createKnight()
        const startSquare = src[1] * 8 + src[0] % 8 
        const endSquare = endPoint[1] * 8 + endPoint[0] % 8 
        const bfs = this.doBFS(startSquare)

        const stepCount = bfs[endSquare].distance

        let currentNode = bfs[endSquare]
        let arr = []
        while (currentNode != null)
        {
            board[currentNode.coord[0]][currentNode.coord[1]] = knight.marker
            arr.push(currentNode.coord)
            currentNode = bfs[currentNode.previous]
        }

        arr.reverse()
        console.log(`You made it in ${stepCount} moves! Here's your path: `)
        for (const coord of arr)
        {
            console.log(`[${coord}]`)
        }
        for (const arr of board)
        {
            console.log(arr)
        }
    }

    createAdjList = () => {
        const adjList = []
        const column0PointUpdates = [-6, -15, 10, 17]
        const column1PointUpdates = [-17, 17, -15, 10, -6, 15]
        const columns2345PointUpdates = [15, 17, 10, -6, -15, -17, -10, 6]
        const column6PointUpdates = [-17, 17, -15, 15, 6, -10]
        const column7PointUpdates = [-17, -10, 6, 15]

        // [[2, -1], [2, 1], [1, 2], [-1, 2], [-2, 1], [-2, -1], [-1, -2], [1, -2]]
        let square = 0;
        while (square < 64)
        {
            let newArr = []
            let pointUpdates;

            if (square % 8 === 0) 
            {
                pointUpdates = column0PointUpdates
            }
            else if (square % 8 === 1)
            {
                pointUpdates = column1PointUpdates
            }
            else if (square % 8 === 6)
            {
                pointUpdates = column6PointUpdates
            }
            else if (square % 8 === 7)
            {
                pointUpdates = column7PointUpdates
            }
            else
            {
                pointUpdates = columns2345PointUpdates
            }

            for (let i = 0; i < pointUpdates.length; i++) 
            {
                let updatedSquare = square + pointUpdates[i]

                if (updatedSquare < 0 || updatedSquare > 63)
                {
                    continue
                }

                newArr.push(updatedSquare)
            }
            square++
            adjList.push(newArr)
        }
        
        return adjList
    }

   doBFS = (src, graph = this.createAdjList()) => {
        const bfsInfo = []

        for (let i = 0; i < graph.length; i++)
        {
            bfsInfo[i] = {
                value: null,
                distance: null,
                previous: null,
                coord: null }
        }

        bfsInfo[src].distance = 0
        // src[0] * 8 + src[1] % 8 
        bfsInfo[src].coord = [src % 8, Math.floor(src / 8)]
        bfsInfo[src].value = src

        let queue = new Queue();
        queue.enqueue(src);

        while (!queue.isEmpty())
        {
            let vertex = queue.dequeue()

            for (let u = 0; u < graph[vertex].length; u++)
            {
                let neighbor = graph[vertex][u]

                if (bfsInfo[neighbor].distance === null)
                {
                    bfsInfo[neighbor].value = graph[vertex][u]
                    bfsInfo[neighbor].distance = bfsInfo[vertex].distance + 1
                    bfsInfo[neighbor].previous = vertex
                    bfsInfo[neighbor].coord = [neighbor % 8, Math.floor(neighbor / 8)]
                    queue.enqueue(neighbor);
                }
            }
        }

        return bfsInfo
    }

}

let t = new Game
t.knightMoves([3, 3], [0, 0])

