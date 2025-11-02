import React from 'react';

const UserToolbar = ({ user, whiteboardId, onSave, onLoad, onDelete }) => {
    return (
        <div>
            {user?.role === 'registered' && (
                <div className="flex flex-row gap-2">
                    <button
                        onClick={onSave}
                        className="px-4 py-2 mt-2 border rounded bg-blue-700 text-white"
                    >
                        Save
                    </button>
                    <button
                        onClick={() => onLoad(whiteboardId)}
                        className="px-4 py-2 mt-2 border rounded bg-blue-700 text-white"
                    >
                        Load
                    </button>
                </div>
            )}
            <div className="flex flex-col">
                <button
                    onClick={() => onDelete(whiteboardId)}
                    className="px-4 py-2 mt-2 border rounded bg-red-600 text-white"
                >
                    Delete
                </button>
            </div>
        </div>
    );
};

export default UserToolbar;
