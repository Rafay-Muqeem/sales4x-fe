
export const Reducer = (state, action) => {
    switch (action.type) {
        case 'SET_INVOICE':
            return ({
                ...state,
                Settings: {
                    ...state.Settings,
                    General: {
                        ...state.Settings.General,
                        invoice: action.payload
                    },
                }
            })
        case 'SET_TOKEN':
            return ({
                ...state,
                userToken: action.payload
            })
        case 'SET_BUSINESS':
            return ({
                ...state,
                business: action.payload
            })
        case 'SET_USER':
            return ({
                ...state,
                userInfo: action.payload,
            })
        case 'RESET':
            return ({
                Settings: {
                    General: {
                        invoice: 'current',
                    },
                },
                userToken: '',
                business: '',
                userInfo: {}
            })
        default:
            return state
    }
}
