const dfs = (node, visited = {}, process = () => {}, reverse = false) => {
  visited[node.id] = true;
  if (reverse) {
	node.prev.forEach(child => {
    	if (!visited[child.id]) {
      		dfs(child, visited, process, reverse);
    	}
  	});
  } else {
	node.next.forEach(child => {
    	if (!visited[child.id]) {
      		dfs(child, visited, process, reverse);
    	}
  	});
  }
  
  process(node);
}

class Node {
  next = []
  prev = []
  cachedValue = null

  constructor(id, value = 0, onUpdate) {
    this.id = id;
    this.value = value;
	this.onUpdate = onUpdate;
    this.cachedValue = value;
  }

  addNext(node) {
    if (!this.next.includes(node)) {
      this.next.push(node);
      this.invalidate();
    }

    if (!node.prev.includes(this)) {
      node.prev.push(this);
    }
  }

  getValue() {
    console.log('gettingValue', this.id)
    if (this.cachedValue !== null) return this.cachedValue;

    const values = {};
    const visited = {};
    dfs(this, visited, child => {
      if (child.id !== this.id) {
		const value = child.getValue();
        values[child.id] = child.value;
	  }
    });

    const value = this.next.reduce((sum, child) => {
      if (values[child.id] !== undefined) {
		sum += values[child.id];
      }
      return sum;
    }, 0);

    console.log('got value', this.id, value);

	this.cachedValue = value;

	if (value !== this.value) {
      this.value = value;
      this.onUpdate(this);
    }
  }

  updateValue(value) {
    this.value = value;
    const visited = {};
    let first;
    dfs(this, visited, child => {
      if (child.id !== this.id) {
        if (!first) first = child;
        child.invalidate();
      }
    }, true)
    if (first) {
      dfs(first, visited, child => {
        if (child.id !== this.id) {
		  child.getValue();
        }      
      });
    }
    
  }

  invalidate() {
    this.cachedValue = null;
  }
}

class Graph {
  vertices = []

  constructor(onUpdate) {
    this.onUpdate = onUpdate;
  }
  
  addVertex(id, value) {
    if (!this.vertices.find(vertex => vertex.id === id)) {
      this.vertices.push(new Node(id, value, this.onUpdate));
    }
  }

  addEdge(from, to) {
    const fromVertex = this.vertices.find(vertex => vertex.id === from);
    const toVertex = this.vertices.find(vertex => vertex.id === to);
    if (fromVertex && toVertex) {
      fromVertex.addNext(toVertex);
    }
  }

  recalculate() {
    this.vertices.forEach(vertex => vertex.getValue());
  }
}
