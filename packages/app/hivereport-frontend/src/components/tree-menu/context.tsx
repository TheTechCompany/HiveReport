import React from 'react';

export const TreeViewContext = React.createContext<{
    onEdit?: (nodeId: string) => void;
    onAdd?: (nodeId: string) => void;

    selected?: any[];
    onSelect?: (nodeId: string, checked: boolean) => void;
}>({});

export const TreeViewProvider = TreeViewContext.Provider