export const adjustShade = (color: string, amount: number) => {
    return '#' + color.replace(/^#/, '').replace(/../g, color => ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
};

export const randomHex = (): string => '#' + (Math.random() * 0xFFFFFF << 0).toString(16);