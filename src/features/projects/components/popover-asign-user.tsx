import * as React from 'react'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

export function PopoverAsignUser() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant='outline'>Assign users to project</Button>
      </PopoverTrigger>
      <PopoverContent className='w-80'>
        <Command className='overflow-hidden'>
          <CommandInput placeholder='Search for users...' />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading='Suggestions'>
              <CommandItem>
                <Label className='flex items-center space-x-2'>
                  <Input type='checkbox' id='user1' />
                  <span>User 1 </span>
                  <span> User 2 </span>
                  <span> User 3 </span>
                  // Add more users and refactor this to be dynamic
                </Label>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
