import { Thought } from '../../../store/rxdb/schemas/thought';
import { Node } from '../../../hooks/useThoughtMap/types';

export interface ThoughtsById {
  [thoughtId: string]: Thought;
}

export default class Grapher {
  private ctx: any;

  drawEdge = (
    [fromX, fromY]: [number, number],
    [toX, toY]: [number, number],
    maxX: number,
    maxY: number,
    canvas: any,
    completed: boolean,
    inProgress: boolean,
  ) => {
    const midXPx = (0.5 / (maxX + 1)) * canvas.width;
    const midYPx = (0.5 / (maxY + 1)) * canvas.height;
    const fromXPx = (fromX / (maxX + 1)) * canvas.width + midXPx;
    const fromYPx = (fromY / (maxY + 1)) * canvas.height + midYPx;
    const toXPx = (toX / (maxX + 1)) * canvas.width + midXPx;
    const toYPx = (toY / (maxY + 1)) * canvas.height + midYPx;
    
    this.ctx.beginPath();
    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = completed ?
      '#8fc84a' : inProgress ?
      '#ffb811' :
      '#676767';
    this.ctx.moveTo(fromXPx, fromYPx);
    this.ctx.lineTo(toXPx, toYPx);
    this.ctx.stroke();
  }

  draw = (canvas: HTMLCanvasElement, tree: Node[], thoughtsById: ThoughtsById): void => {
    if (!this.ctx) this.ctx = canvas.getContext('2d');
    this.ctx.fillStyle = "#272727";
    this.ctx.fillRect(0, 0, canvas.width, canvas.height);
    let maxX = 0, maxY = 0;

    const nodeMap = tree.reduce((next, { x, y, vertex }) => {
      next[vertex.id] = {
        x, y, to: [],
      };
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
      vertex.next.forEach(child => {
        if (next[child.id]) {
          next[child.id].to.push(vertex.id);
        }
      });
      return next;
    }, {} as { [id: string]: { x: number, y: number, to: string[] }});

    Object.entries(nodeMap).forEach(([fromId, { x, y, to }]) => {
      to.forEach(toId => {
        const toNode = nodeMap[toId];
        const completed = thoughtsById[toId].status === 'completed';
        const inProgress = !completed && thoughtsById[toId].status !== 'new';

        this.drawEdge([x, y], [toNode.x, toNode.y], maxX, maxY, canvas, completed, inProgress);
      });
    });
  }
}
