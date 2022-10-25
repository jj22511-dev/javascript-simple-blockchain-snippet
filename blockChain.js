const { createHash } = require('crypto');

// data is normally for transaction.
class Block {
    constructor(timestamp = "", data = []) {
        this.timestamp = timestamp;
        this.data = data;
        this.hash = this.getHash();
        this.previousHash = "";
    }

    getHash() {
        let hashedString = JSON.stringify(this.data) + this.timestamp + this.previousHash;
        return createHash('sha256').update(hashedString).digest('hex');
    }
}

class BlockChain {
    constructor() {
        this.chain = [ 
            this.createGenesisBlock()
        ]
    }

    createGenesisBlock() {
        return new Block(Date.now().toString(), [])
    }

    getLastBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(block) {
        block.previousHash = this.getLastBlock().hash;
        block.hash = block.getHash();

        this.chain.push(block);
    }

    isValid() {
        const chain = this.chain;

        for (let i = 1; i < chain.length; i++) {
            const currentChain = chain[i];
            const previousChain = chain[i-1];

            if (currentChain.hash !== currentChain.getHash() || currentChain.previousHash !== previousChain.hash) {
                return false;
            }
        } 

        return true;
    }
}

let bChain = new BlockChain();
bChain.addBlock( new Block(Date.now().toString(), [{fee: 1_000_000, }]) )
bChain.addBlock( new Block(Date.now().toString(), [{fee: 2_000_000, }]) )
bChain.addBlock( new Block(Date.now().toString(), [{fee: 4_000_000, }]) )
bChain.addBlock( new Block(Date.now().toString(), [{fee: 6_000_000, }]) )

console.log(bChain.chain)
console.log("isValidChain?", bChain.isValid())

// Manipulate Block Data
bChain.chain[1].data = ["Manipulated Block!!"]
console.log("Successfully Updated a Block!")
console.log("isValidChain?", bChain.isValid())