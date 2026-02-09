import Link from 'next/link'
import React from 'react'

export default function Header() {
    return (
        <div className="max-w-6xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">
                        Linkt
                    </h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Documentation that stays in sync with code
                    </p>
                </div>
                <Link
                    href="/editor"
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition text-sm"
                >
                    + Add New Document
                </Link>
            </div>
        </div>
    )
}
