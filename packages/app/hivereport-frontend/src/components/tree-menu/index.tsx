import React from 'react';

import { TreeView, TreeItem, TreeItemProps } from '@mui/lab'
import { Add, ChevronRight, ExpandMore } from '@mui/icons-material';
import { CustomTreeItem, MenuItem, MenuItemGroup } from './item';
import { TreeViewProvider } from './context';
import { Box, IconButton, Typography } from '@mui/material';
import { BaseStyle } from '@hexhive/styles';

export interface TreeMenuProps {
    onNodeSelect?: (nodeId: string) => void;
    onEdit?: (nodeId: string) => void;
    onAdd?: (nodeId?: string) => void;
    onSelect?: (nodeId: string, checked: boolean) => void;

    gatewaySchema?: any[]

    selected?: any[];

    label?: string;
}

export const TreeMenu: React.FC<TreeMenuProps> = (props) => {
    return (
        <TreeViewProvider value={{ selected: props.selected, onSelect: props.onSelect, onEdit: props.onEdit, onAdd: props.onAdd }}>
            <TreeView
                sx={{ flex: 1, userSelect: 'none', maxWidth: `100%` }}
                defaultCollapseIcon={<ExpandMore />}
                defaultExpandIcon={<ChevronRight />}
            >
                {props?.gatewaySchema?.map((query) => (
                    <CustomTreeItem
                        nodeId={query.key} 
                        label={query.key} >
                        {query.returnType?.fields?.map((field) => (
                            <CustomTreeItem
                                nodeId={`${query.key}.${field.name}`}
                                label={field.name} />
                        ))}
                    </CustomTreeItem>
                ))}
            </TreeView>
        </TreeViewProvider>
    )
}