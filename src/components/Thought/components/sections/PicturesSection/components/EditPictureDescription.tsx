import React, { FC, useState, FormEvent } from 'react';
import { withStyles, StyleRules } from '@material-ui/styles';
import { Picture } from '~store/rxdb/schemas/types';
import Input from '../../../../../General/Input';
import { pictures as pictureActions } from '../../../../../../actions';
import { useLoadedDB } from '../../../../../../hooks/useDB';

interface EditPictureDescriptionProps {
  classes: any,
  onClose: () => void;
  picture: Picture;
}

const styles = (theme: any): StyleRules => ({
    form: {
        display: 'flex',
        flexDirection: 'column',
    },
    inputLabel: {
        '& input': {
            width: '100%',
        },
    },
    submitButton: () => ({
        marginTop: 10,
        marginLeft: 'auto',
        color: theme.palette.secondary[700],
        fontWeight: 600,
        cursor: 'pointer',
        userSelect: 'none',
    }),
});

export const EditPictureDescription: FC<EditPictureDescriptionProps> = ({ classes, onClose, picture }) => {
    const [inputtedValue, setInputtedValue] = useState<string>(picture.description || '');
    const disableSubmit = (inputtedValue === picture.description) || (inputtedValue === '' && !picture.description);
    const { db } = useLoadedDB();
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (disableSubmit === false) {
            await pictureActions.editPicture(db, {
                ...picture,
                description: inputtedValue.trim(),
            });
            onClose();
        }
    };

    return (
        <form className={classes.form} onSubmit={handleSubmit}>
            <Input
                value={inputtedValue}
                classes={classes}
                autoFocus={true}
                onChange={e => setInputtedValue(e.target.value)}
            />
            <button
                className={classes.submitButton}
                disabled={disableSubmit}
            >
        Update
            </button>
        </form>
    );
};

export default withStyles(styles)(EditPictureDescription);
