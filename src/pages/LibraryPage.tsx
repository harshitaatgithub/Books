import React from 'react';
import Library from './Library';

interface Props {
  searchQuery: string;
  selectedAuthor: string;
}

const LibraryPage: React.FC<Props> = ({ searchQuery, selectedAuthor }) => {
  return (
    <Library
      searchQuery={searchQuery}
      selectedAuthor={selectedAuthor}
    />
  );
};

export default LibraryPage;
