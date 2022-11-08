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

type Duration =
    | '1 hour'
    | '2 hours'
    | '3 hours'
    | '4 hours'
    | '5 hours'
    | '6 hours'
    | '7 hours'
    | '8 hours'
    | 'next workday'

// type Reservations = Record<string, { name: string; duration: string }[]>
type Reservations = Record<string, { name: string; duration: Duration }[]>

function isDuration(duration: string): duration is Duration {
    return [
        '1 hour',
        '2 hours',
        '3 hours',
        '4 hours',
        '5 hours',
        '6 hours',
        '7 hours',
        '8 hours',
        'next workday',
    ].includes(duration)
}

const Home: NextPage = () => {
    const currentTime = new Date()
    const [date, setDate] = useState<null | Date>(null)
    const [name, setName] = useState('')
    const [duration, setDuration] = useState<Duration>('1 hour')

    const [reservations, setReservations] = useState<Reservations>({
        '2022-11-09': [
            {
                name: 'John Doe',
                duration: '1 hour',
            },
            {
                name: 'Jane Doe',
                duration: '2 hours',
            },
        ],
    })
    // const [workingHours, setWorkingHours] = useState([
    //     { start: '09:00', end: '17:00' },
    // ])
    const workingHours = [
        '09:00',
        '10:00',
        '11:00',
        '12:00',
        '13:00',
        '14:00',
        '15:00',
        '16:00',
        '17:00',
    ]

    const hoursLeftUntilWorkdayEnds = () => {
        const now = new Date()
        const today = format(now, 'yyyy-MM-dd')
        const todayEnd = new Date(
            `${today}T${workingHours[workingHours.length - 1]}:00`,
        )
        // return formatDistance(now, todayEnd).replace('about ', '')
        const result = new Date(todayEnd).getTime() - new Date(now).getTime()
        const hours = Math.floor(result / 1000 / 60 / 60)
        const minutes = Math.floor((result / 1000 / 60 / 60 - hours) * 60)
        // return `${hours} hours and ${minutes} minutes`
        return [hours, minutes]
    }

    console.log('hours left: ', hoursLeftUntilWorkdayEnds())

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        console.log({ name, duration })
        if (date) {
            const dateKey = format(date, 'yyyy-MM-dd')
            const reservation = { name, duration }
            setReservations((prev) => ({
                ...prev,
                [dateKey]: [...(prev[dateKey] || []), reservation],
            }))
        }
    }

    const inputDisabled = !date
    const formattedDate = date ? format(date, 'yyyy-MM-dd') : ''
    // console.log(date)
    if (date) {
        // console.log(format(date, 'yyyy-MM-dd'))
        console.log('HH:mm', format(currentTime, 'HH:mm'))
        console.log('HH', format(currentTime, 'HH'))

        console.log('date', date)
        console.log('formattedDate', formattedDate)
        // console.log(
        //     'subHours',
        //     format(subHours(currentTime, -workingHours[0]), 'HH:mm'),
        // )
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
                        onChange={(e) => {
                            if (isDuration(e.target.value)) {
                                setDuration(e.target.value)
                            }
                        }}
                        placeholder="Enter duration"
                    >
                        {new Array(hoursLeftUntilWorkdayEnds()[0])
                            .fill(0)
                            .map((_, i) => {
                                const hours = i + 1
                                const text = `${hours} hour${
                                    hours > 1 ? 's' : ''
                                }`
                                return (
                                    <option key={hours} value={text}>
                                        {text}
                                    </option>
                                )
                            })}
                        <option value="next workday">next workday</option>
                    </select>
                    <button
                        disabled={!name || !duration}
                        className="mt-4 bg-blue-500 transition-colors hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:hover:bg-blue-500 disabled:cursor-not-allowed"
                    >
                        Reserve
                    </button>
                </form>
                <ul className="mt-4 flex flex-col items-center">
                    {reservations[formattedDate]?.map((reservation) => (
                        <li key={reservation.name}>
                            <span className="mr-4">
                                {' '}
                                name: {reservation.name}
                            </span>
                            <span> duration: {reservation.duration}</span>
                        </li>
                    ))}
                </ul>
            </main>

            {/* <footer className="flex h-24 w-full items-center justify-center border-t">
      </footer> */}
        </div>
    )
}

export default Home
