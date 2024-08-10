export default function DeleteExpenseModal({openDelete, onClose, children}){
    return (
        <div onClick={onClose} className={`fixed inset-0 flex justify-center items-center transition-colors ${openDelete ? "visible bg-black/10": "invisible"}`}>
            
            <div onClick={e => e.stopPropagation()} className={`bg-white sm:w-1/2 lg:w-1/4 rounded-xl shadow p-4 transition-all text-black ${openDelete ? "scale-100 opacity-100" : "scale-125 opacity-0"}`}>
                <button onClick={onClose} className={`text-3xl absolute top-4 right-4 p-1 rounded-lg text-gray-400 bg-white hover:bg-gray-50 hover:text-gray-600`}>
                    X
                </button>

                {children}
            </div>
            
        </div>
    )
}