import React, { FC, useRef } from 'react';
import { Thought } from 'store/rxdb/schemas/thought';
import { thoughts as thoughtActions } from '../../../actions';
import cn from 'classnames';
import { useLoadedDB } from '../../../hooks/useDB';
import { useLoadingOverlay } from '../../../hooks/useLoadingOverlay';

export interface ArchiveThoughtsProps {
    classes: any;
    thoughts: Thought[];
}

export const ArchiveThoughts: FC<ArchiveThoughtsProps> = ({
    classes,
    thoughts,
}) => {
    const { db } = useLoadedDB();
    const rootRef = useRef<HTMLDivElement>(null);
    const [setIsLoading, stopIsLoading] = useLoadingOverlay(rootRef);

    const handleClickArchiveNew = async () => {
        setIsLoading('Archiving thoughts...');
        await Promise.all(thoughts
            .filter(({ status }) => status === 'new')
            .map(thought => thoughtActions.editThought(db, {
                ...thought,
                archived: true,
            })));
        stopIsLoading();
    };

    const handleClickArchiveCompleted = async () => {
        setIsLoading('Archiving thoughts...');
        await Promise.all(thoughts
            .filter(({ status }) => status === 'completed')
            .map(thought => thoughtActions.editThought(db, {
                ...thought,
                archived: true,
            })));
        stopIsLoading();
    };

    return (
        <div ref={rootRef} className={classes.archiveThoughts}>
            <h3 className={classes.archiveThoughtsHeader}>
                Archive Thoughts
            </h3>
            <button
                className={cn(classes.archiveThoughtsButton, 'new')}
                onClick={handleClickArchiveNew}
            >
                New
            </button>
            <button
                className={cn(classes.archiveThoughtsButton, 'completed')}
                onClick={handleClickArchiveCompleted}
            >
                Completed
            </button>
        </div>
    );
};

export default ArchiveThoughts
