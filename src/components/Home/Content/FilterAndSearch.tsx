import React, { FC, FormEventHandler } from 'react';
import ExpandMore from '@material-ui/icons/ExpandMore';
import ExpandLess from '@material-ui/icons/ExpandLess';
import UnfoldMore from '@material-ui/icons/UnfoldMore';
import classNames from 'classnames';
import Input from '../../General/Input';
import { useDispatch } from 'react-redux';
import Search from '@material-ui/icons/Search';
import Close from '@material-ui/icons/Close';
import useLongPress from '../../../hooks/useLongPress';
import { sortBy, SortFilterField, SortFilterSettings } from '../../../reducers/sortFilterSettings';

interface FilterAndSearchProps {
  classes: any;
  setShowFilters: (show: boolean) => void;
  showFilters: boolean;
  searchTerm: string;
  sortFilterSettings: SortFilterSettings;
  setSearchTerm: (value: string) => void;
}

export const FilterAndSearch: FC<FilterAndSearchProps> = ({
  classes,
  setShowFilters,
  showFilters,
  searchTerm,
  sortFilterSettings,
  setSearchTerm,
}) => {
  const dispatch = useDispatch();

  const handleLongPress = useLongPress(() => {
    setShowFilters(false);
  });
  const handleSubmitSearch: FormEventHandler = e => {
    e.preventDefault();
  };
  const handleSortBy = (name: SortFilterField) => () => dispatch(sortBy(name));
  const isSearching = showFilters === false || searchTerm !== '';

  return (
    <div className={classes.flippableWrapper} {...handleLongPress}>
      <div className={classNames(classes.sortByButtons, 'flippable', isSearching ? 'back' : 'front')}>
        <div className={classes.sortByNames}>
          <button className={classNames(classes.sortButton, {
            selected: sortFilterSettings.field === SortFilterField.Title
          })} onClick={handleSortBy(SortFilterField.Title)}>
            Name
            {sortFilterSettings.field === SortFilterField.Title ?
              (sortFilterSettings.desc ? <ExpandMore /> : <ExpandLess />) :
              <UnfoldMore />
            }
          </button>
        </div>
        <div className={classes.sortByStatus}>
          <button className={classNames(classes.sortButton, {
            selected: sortFilterSettings.field === SortFilterField.Status
          })} onClick={handleSortBy(SortFilterField.Status)}>
            Status
        </button>
          /
        <button className={classNames(classes.sortButton, {
            selected: sortFilterSettings.field === SortFilterField.Type
          })} onClick={handleSortBy(SortFilterField.Type)}>
            Type
        </button>
          {[SortFilterField.Status, SortFilterField.Type].includes(sortFilterSettings.field) ?
            (sortFilterSettings.desc ? <ExpandMore /> : <ExpandLess />) :
            <UnfoldMore />
          }
        </div>
      </div>
      <form className={classNames(classes.searchWrapper, 'flippable', isSearching ? 'front' : 'back')} onSubmit={handleSubmitSearch}>
        <Input classes={classes} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} aria-label={'Search'} autoCapitalize={'none'} />
        {searchTerm === '' ?
          (<button className={classes.searchButton}><Search /></button>) :
          (<button className={classes.searchButton} onClick={() => setSearchTerm('')}><Close /></button>)}
      </form>
    </div>
  );
};

export default FilterAndSearch;
