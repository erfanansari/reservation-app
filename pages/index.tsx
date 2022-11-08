import type { NextPage } from 'next'
import Head from 'next/head'
import { useState } from 'react'
import Calendar from 'react-calendar'
import {
    compareAsc,
    format,
    formatDistance,
    subDays,
    subHours,
    subMonths,
} from 'date-fns'

const Home: NextPage = () => {
    const [date, setDate] = useState<null | Date>(null)
    // const [date, setDate] = useState(new Date())
    const [name, setName] = useState('')
    const [duration, setDuration] = useState('1')
    const workingHours = ['09', '10', '11', '12', '13', '14', '15', '16', '17']

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        console.log({ name, duration })
        alert(`${name} ${duration}`)
    }

    const inputDisabled = !date

    const currentTime = new Date()

    // console.log(date)
    if (date) {
        // console.log(format(date, 'yyyy-MM-dd'))
        console.log('HH:mm', format(currentTime, 'HH:mm'))

        console.log('date', date)
        console.log(
            'subHours',
            format(subHours(currentTime, -workingHours[0]), 'HH:mm'),
        )
        console.log(formatDistance(date, new Date()))
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center py-2">
            <Head>
                <title>Create Next App</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <header className="mt-14">
                <h1 className="text-4xl lg:text-6xl font-bold">
                    Welcome to the{' '}
                    <p className="text-blue-600 sm:inline">Reservation App</p>
                </h1>
            </header>
            <main className="flex w-full flex-1 flex-col items-center mt-16 md:px-20 text-center">
                <form onSubmit={onSubmit} className="flex flex-col md:w-[50%]">
                    <div className="mx-auto mb-8 flex min-h-[308px]">
                        <Calendar
                            className="border-1 border-gray-300 rounded-md"
                            value={date}
                            onChange={setDate}
                            tileDisabled={({ date }) =>
                                date.getDay() === 0 ||
                                date.getDay() === 6 ||
                                date.getTime() <
                                    new Date().getTime() - 1000 * 60 * 60 * 24
                            }
                        />
                    </div>
                    <input
                        type="text"
                        className="border-2 border-gray-300 bg-white h-11 px-5 pr-16 rounded-lg text-md focus:outline-none
                        disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={inputDisabled}
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <select
                        name="duration"
                        id="duration"
                        className="mt-6 border-2 border-gray-300
                      bg-white h-11 px-4 pr-16 rounded-lg text-md focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={inputDisabled}
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        placeholder="Enter duration"
                    >
                        {workingHours.map((hour) => (
                            <option key={hour} value={hour}>
                                {hour}
                            </option>
                        ))}
                    </select>
                    <button
                        disabled={!name || !duration}
                        className="mt-4 bg-blue-500 transition-colors hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:hover:bg-blue-500 disabled:cursor-not-allowed"
                    >
                        Reserve
                    </button>
                </form>
                <ul>
                    <li>
                        date: {date && format(new Date(), 'yyyy-MM-dd HH:mm')}
                    </li>
                    <li>name: Reza</li>
                </ul>
            </main>

            {/* <footer className="flex h-24 w-full items-center justify-center border-t">
      </footer> */}
        </div>
    )
}

export default Home
