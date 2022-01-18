import { Searchable, Notes, Tags } from '../';
import { Thought } from '../../../../store/rxdb/schemas/thought';
import { Note } from '../../../../store/rxdb/schemas/note';
import { Tag } from '../../../../store/rxdb/schemas/tag';

const mockThought = (title: string, idx: number): Thought => ({
    id: `thought-${idx}`,
    title,
    sections: null,
});

const mockNote = ([text, thoughtIndex]: [string, number], idx: number): Note => ({
    thoughtId: `thought-${thoughtIndex}`,
    id: `note-${idx}`,
    text,
});

const mockTag = ([text, thoughtIndex]: [string, number], idx: number): Tag => ({
    thoughtId: `thought-${thoughtIndex}`,
    id: `tag-${idx}`,
    text,
});

const thoughts: Thought[] = [
    'A car and a cat are not a cab',
    'Supercalifragilisticexpialidocious is a long word',
    '1:50 2',
].map(mockThought);

const notes: Notes = [
    ['This note has text', 0],
    ['1 2 3:50', 0],
    ['CABS', 1],
    ['', 1],
    ['fffffffffffffffffffffff', 2],
    ['This note points to a thought that does not exist', 3],
]
    .map(mockNote)
    .reduce((next, note) => {
        next[note.id] = note;

        return next;
    }, {} as Notes);

const tags: Tags = [
    ['good', 0],
    ['cooL', 0],
    ['important', 1],
    ['nice', 1],
    ['aaaaaaaaaaaaaaaaa', 2],
    ['non-existing', 3],
]
    .map(mockTag)
    .reduce((next, tag) => {
        next[tag.id] = tag;

        return next;
    }, {} as Tags);

describe('Searchable', () => {
    test('It works', () => {
        expect(() => {
            const searcher = new Searchable();
        }).not.toThrow();
    });
    test('#buildTree - just thoughts', () => {
        const searcher = new Searchable();
        searcher.buildTree(thoughts);

        const longMatchResult = searcher.findMatches('frag');
        expect(longMatchResult).toHaveLength(1);
        expect(longMatchResult[0]).toEqual('thought-1');

        const multipleMatches = searcher.findMatches('ca');
        expect(multipleMatches).toHaveLength(2);
        expect(
            ['thought-0', 'thought-1']
                .every(id => multipleMatches.includes(id))
        ).toBe(true);
    });

    test('#buildTree - with notes', () => {
        const searcher = new Searchable();
        searcher.buildTree(thoughts, notes);

        const matchFromNote = searcher.findMatches('ffffffffff');
        expect(matchFromNote).toHaveLength(1);
        expect(matchFromNote[0]).toEqual('thought-2');
    
        //Finds match even if thought isn't present
        const matchWithoutThought = searcher.findMatches('exist');
        expect(matchWithoutThought).toHaveLength(1);
        expect(matchWithoutThought[0]).toEqual('thought-3');
    });

    test('#buildTree - with tags', () => {
        const searcher = new Searchable();
        searcher.buildTree(thoughts, null, tags);

        const incorrectCaseResults = searcher.findMatches('AAAAAAAA');
        expect(incorrectCaseResults).toHaveLength(1);
        expect(incorrectCaseResults[0]).toEqual('thought-2');
    });

    test('#buildTree - all', () => {
        const searcher = new Searchable();

        searcher.buildTree(thoughts, notes, tags);

        const longMatchResult = searcher.findMatches('o');
        expect(longMatchResult).toHaveLength(3);
    
        const noResults = searcher.findMatches('xxxxx');
        expect(noResults).toHaveLength(0);

        const multipleWordSearch = searcher.findMatches('note poin');
        expect(multipleWordSearch).toHaveLength(1);
    });
});
