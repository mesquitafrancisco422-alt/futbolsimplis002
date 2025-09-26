import React from 'react';

type NotificationPermission = 'default' | 'granted' | 'denied';

interface NotificationBellProps {
    permission: NotificationPermission;
    requestPermission: () => void;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ permission, requestPermission }) => {
    const getIcon = () => {
        switch (permission) {
            case 'granted':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                );
            case 'denied':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-4-5.658" />
                    </svg>
                );
            default:
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                );
        }
    }

    const getTooltip = () => {
         switch (permission) {
            case 'granted':
                return 'Notificações ativadas';
            case 'denied':
                return 'Notificações bloqueadas';
            default:
                return 'Ativar notificações';
        }
    }

    return (
        <button
            onClick={requestPermission}
            disabled={permission !== 'default'}
            className="relative group p-2 rounded-full transition-colors text-gray-300 hover:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-400"
            aria-label={getTooltip()}
        >
            {getIcon()}
            <div className="absolute bottom-full mb-2 hidden group-hover:block w-max bg-gray-800 text-white text-xs rounded py-1 px-2">
                {getTooltip()}
            </div>
        </button>
    );
};

export default NotificationBell;
